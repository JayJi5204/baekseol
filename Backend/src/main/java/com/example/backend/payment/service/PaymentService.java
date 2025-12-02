package com.example.backend.payment.service;

import com.example.backend.global.exception.CustomException;
import com.example.backend.global.security.TokenService;
import com.example.backend.payment.config.PaymentClient;
import com.example.backend.payment.dto.PaymentResponseDto;
import com.example.backend.payment.dto.WithdrawalResponseDto;
import com.example.backend.payment.entity.Payment;
import com.example.backend.payment.entity.PaymentEvent;
import com.example.backend.payment.entity.WithdrawalRequest;
import com.example.backend.payment.entity.WithdrawalTransaction;
import com.example.backend.payment.enumType.TransactionStatus;
import com.example.backend.payment.repository.PaymentEventRepository;
import com.example.backend.payment.repository.PaymentRepository;
import com.example.backend.payment.repository.WithdrawalRequestRepository;
import com.example.backend.payment.repository.WithdrawalTransactionRepository;
import com.example.backend.point.service.PointService;
import com.example.backend.user.entity.UserEntity;
import com.example.backend.user.repository.UserRepository;
import com.example.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.antlr.v4.runtime.Token;
import org.json.simple.JSONObject;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.example.backend.payment.exception.PaymentErrorType.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentClient paymentClient;
    private final PaymentRepository paymentRepository;
    private final PaymentEventRepository paymentEventRepository;
    private final WithdrawalRequestRepository withdrawalRepository;
    private final WithdrawalTransactionRepository withdrawalTransactionRepository;
    private final UserRepository userRepository;
    private final PointService pointService;
    private final TokenService tokenService;
    private final UserService userService;

    // ===================== 결제 관련 =====================

    @Transactional
    public PaymentResponseDto requestPayment(Long userId, Long amount,
                                             String orderId, String orderName,
                                             String paymentKey) {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ERROR_USER_NOT_FOUND));

        if (paymentKey == null || paymentKey.trim().isEmpty()) {
            throw new CustomException(ERROR_PAYMENT_KEY_EMPTY);
        }

        // ✅ PointService에서 수수료 가져오기
        if (amount <= pointService.getPaymentFee()) {
            throw new CustomException(ERROR_PAYMENT_INVALID_AMOUNT);
        }

        Payment existingPayment = paymentRepository.findByPaymentKey(paymentKey).orElse(null);

        if (existingPayment != null) {
            if (existingPayment.getStatus() == TransactionStatus.CONFIRMED) {
                throw new CustomException(ERROR_PAYMENT_ALREADY_CONFIRMED);
            } else if (existingPayment.getStatus() == TransactionStatus.PROCESSING) {
                throw new CustomException(ERROR_PAYMENT_IN_PROCESSING);
            } else if (existingPayment.getStatus() == TransactionStatus.FAILED) {
                log.info("이전 실패한 결제를 재처리: paymentId={}", existingPayment.getPaymentId());
                existingPayment.resetForRetry();
                paymentRepository.save(existingPayment);

                recordPaymentEvent(existingPayment, TransactionStatus.PENDING,
                        "결제 재시도 요청됨", null);

                processPaymentAsync(existingPayment);
                return PaymentResponseDto.from(existingPayment);
            }
        }

        Payment payment = Payment.builder()
                .userId(userId)
                .orderId(orderId)
                .amount(amount)
                .paymentKey(paymentKey)
                .status(TransactionStatus.PENDING)
                .tossOrderName(orderName)
                .build();

        Payment saved = paymentRepository.save(payment);

        recordPaymentEvent(saved, TransactionStatus.PENDING,
                "결제 요청 생성됨 (결제금액=" + amount + "원, 수수료=" + pointService.getPaymentFee() + "원)", null);

        log.info("결제 요청 생성: paymentId={}, userId={}, 최종결제금액={}, 수수료={}",
                saved.getPaymentId(), userId, amount, pointService.getPaymentFee());

        processPaymentAsync(saved);

        return PaymentResponseDto.from(saved);
    }

    @Async
    @Transactional
    public void processPaymentAsync(Payment payment) {
        Long paymentId=payment.getPaymentId();
        try {
            String paymentKey=payment.getPaymentKey();
            payment.startProcessing(paymentKey);
            paymentRepository.save(payment);

            recordPaymentEvent(payment, TransactionStatus.PROCESSING,
                    "결제 처리 시작됨", null);

            log.info("결제 처리 시작: paymentId={}", paymentId);

            JSONObject body = new JSONObject();
            body.put("paymentKey", paymentKey);
            body.put("amount", payment.getAmount());
            body.put("orderId", payment.getOrderId());
            body.put("orderName", payment.getTossOrderName());

            JSONObject response = paymentClient.confirmPayment(body);

            String status = (String) response.get("status");

            if ("DONE".equals(status)) {
                payment.confirmPayment(
                        LocalDateTime.now(),
                        LocalDateTime.now(),
                        (String) ((Map) response.get("receipt")).get("url"),
                        (String) response.get("method")
                );
                paymentRepository.save(payment);

                log.info("결제 승인: paymentId={}", paymentId);

                // ✅ 포인트 충전 = 실제 결제 금액 - 수수료
                long pointsToCharge = payment.getAmount() - pointService.getPaymentFee();

                pointService.chargePoints(payment);

                recordPaymentEvent(payment, TransactionStatus.CONFIRMED,
                        "결제 승인 완료 (충전포인트=" + pointsToCharge + "원)", null);

                log.info("✅ 포인트 충전 완료: paymentId={}, 결제금액={}, 수수료={}, 충전포인트={}",
                        paymentId, payment.getAmount(), pointService.getPaymentFee(), pointsToCharge);

            } else {
                throw new CustomException(ERROR_PAYMENT_CONFIRM_FAILED);
            }

        } catch (Exception e) {
            log.error("결제 처리 오류: paymentId={}, error={}", paymentId, e.getMessage(), e);
            payment.failPayment();
            paymentRepository.save(payment);

            recordPaymentEvent(payment, TransactionStatus.FAILED,
                    "결제 실패", e.getMessage());
        }
    }

    public PaymentResponseDto getPayment(Long userId, Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new CustomException(ERROR_PAYMENT_NOT_FOUND));

        if (!payment.getUserId().equals(userId)) {
            throw new CustomException(UNAUTHORIZED_ACCESS);
        }

        return PaymentResponseDto.from(payment);
    }

    @Transactional
    public List<PaymentResponseDto> getPaymentList(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ERROR_USER_NOT_FOUND));

        List<Payment> payments = paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
        log.info("결제 목록 조회: userId={}, count={}", userId, payments.size());

        return payments.stream()
                .map(PaymentResponseDto::from)
                .collect(Collectors.toList());
    }

    // ===================== 환급 관련 =====================

    @Transactional
    public WithdrawalResponseDto requestWithdrawal(Long userId, Long amount,
                                                   String bankCode, String account) {


        userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ERROR_USER_NOT_FOUND));

        if (amount <= 0) {
            throw new CustomException(ERROR_WITHDRAWAL_INVALID_AMOUNT);
        }

        Long userPoints = pointService.getUserPoints(userId);
        if (userPoints < amount) {
            throw new CustomException(ERROR_WITHDRAWAL_INSUFFICIENT_POINTS);
        }

        if (bankCode == null || bankCode.trim().isEmpty()) {
            throw new CustomException(ERROR_WITHDRAWAL_INVALID_BANK_CODE);
        }

        if (account == null || account.trim().isEmpty()) {
            throw new CustomException(ERROR_WITHDRAWAL_INVALID_ACCOUNT);
        }

        // ✅ PointService에서 수수료 가져오기
        if (amount - pointService.getWithdrawalFee() <= 0) {
            throw new CustomException(ERROR_WITHDRAWAL_FEE_EXCEEDS_AMOUNT);
        }

        WithdrawalRequest withdrawal = WithdrawalRequest.builder()
                .userId(userId)
                .amount(amount)
                .bankCode(bankCode)
                .account(account)
                .status(TransactionStatus.PENDING)
                .build();

        WithdrawalRequest saved = withdrawalRepository.save(withdrawal);

        recordWithdrawalEvent(saved.getWithdrawalId(), TransactionStatus.PENDING,
                "환급 요청 생성됨", null);

        log.info("환급 요청: withdrawalId={}, userId={}, 요청금액={}, 수수료={}",
                saved.getWithdrawalId(), userId, amount, pointService.getWithdrawalFee());

        processWithdrawalAsync(saved);

        return WithdrawalResponseDto.from(saved);
    }

    @Async
    @Transactional
    public void processWithdrawalAsync(WithdrawalRequest withdrawal) {
        try {

            withdrawal.startProcessing();
            withdrawalRepository.save(withdrawal);

            JSONObject processingLog = new JSONObject();
            processingLog.put("event", "환급 처리 시작");
            processingLog.put("status", "PROCESSING");
            processingLog.put("timestamp", System.currentTimeMillis());

            WithdrawalTransaction processingTran = WithdrawalTransaction.builder()
                    .withdrawalRequest(withdrawal)
                    .status(TransactionStatus.PROCESSING)
                    .resultData(processingLog.toJSONString())
                    .build();
            withdrawalTransactionRepository.save(processingTran);

            recordWithdrawalEvent(withdrawal.getWithdrawalId(), TransactionStatus.PROCESSING,
                    "환급 처리 시작됨", null);

            log.info("환급 처리 시작: withdrawalId={}, 요청금액={}", withdrawal.getWithdrawalId(), withdrawal.getAmount());

            // ✅ 수수료 제외한 환급 금액
            long payAmount = withdrawal.getAmount() - pointService.getWithdrawalFee();
            if (payAmount <= 0) {
                throw new CustomException(ERROR_WITHDRAWAL_FEE_EXCEEDS_AMOUNT);
            }

            String payoutId = "TEST_PAYOUT_" + withdrawal + "_" + System.currentTimeMillis();
            withdrawal.complete(payoutId);
            withdrawalRepository.save(withdrawal);

            JSONObject completedLog = new JSONObject();
            completedLog.put("event", "환급 완료");
            completedLog.put("status", "COMPLETED");
            completedLog.put("payoutId", payoutId);
            completedLog.put("originalAmount", withdrawal.getAmount());
            completedLog.put("fee", pointService.getWithdrawalFee());
            completedLog.put("payAmount", payAmount);
            completedLog.put("message", payAmount + "원 환급");
            completedLog.put("timestamp", System.currentTimeMillis());

            WithdrawalTransaction completedTran = WithdrawalTransaction.builder()
                    .withdrawalRequest(withdrawal)
                    .status(TransactionStatus.COMPLETED)
                    .resultData(completedLog.toJSONString())
                    .build();
            withdrawalTransactionRepository.save(completedTran);

            recordWithdrawalEvent(withdrawal.getWithdrawalId(), TransactionStatus.COMPLETED,
                    "환급 완료", null);

            pointService.usePoints(withdrawal);

            log.info("✅ 환급 완료: withdrawalId={}, 환급금액={}, 수수료={}",
                    withdrawal.getWithdrawalId(), payAmount, pointService.getWithdrawalFee());

        } catch (Exception e) {
            log.error("환급 처리 오류: withdrawalId={}, error={}", withdrawal.getWithdrawalId(), e.getMessage(), e);

            try {
                withdrawal.fail(e.getMessage());
                withdrawalRepository.save(withdrawal);

                JSONObject failedLog = new JSONObject();
                failedLog.put("event", "환급 실패");
                failedLog.put("status", "FAILED");
                failedLog.put("error", e.getMessage());
                failedLog.put("timestamp", System.currentTimeMillis());

                WithdrawalTransaction failedTran = WithdrawalTransaction.builder()
                        .withdrawalRequest(withdrawal)
                        .status(TransactionStatus.FAILED)
                        .errorMessage(e.getMessage())
                        .resultData(failedLog.toJSONString())
                        .build();
                withdrawalTransactionRepository.save(failedTran);

                recordWithdrawalEvent(withdrawal.getWithdrawalId(), TransactionStatus.FAILED,
                        "환급 실패", e.getMessage());

            } catch (Exception ex) {
                log.error("환급 실패 기록 오류: {}", ex.getMessage());
            }
        }
    }

    public WithdrawalResponseDto getWithdrawal(Long userId, Long withdrawalId) {
        WithdrawalRequest withdrawal = withdrawalRepository.findById(withdrawalId)
                .orElseThrow(() -> new CustomException(WITHDRAWAL_NOT_FOUND));

        if (!withdrawal.getUserId().equals(userId)) {
            throw new CustomException(UNAUTHORIZED_ACCESS);
        }

        return WithdrawalResponseDto.from(withdrawal);
    }

    public List<WithdrawalResponseDto> getWithdrawalList(Long userId) {
        List<WithdrawalRequest> withdrawals = withdrawalRepository.findByUserId(userId);

        return withdrawals.stream()
                .map(WithdrawalResponseDto::from)
                .collect(Collectors.toList());
    }

    // ===================== 이벤트 기록 =====================

    private void recordPaymentEvent(Payment payment, TransactionStatus status,
                                    String description, String errorMessage) {
        PaymentEvent event = PaymentEvent.builder()
                .payment(payment)
                .status(status)
                .description(description)
                .errorMessage(errorMessage)
                .build();
        paymentEventRepository.save(event);
        log.info("결제 이벤트 기록: paymentId={}, status={}, description={}", payment.getPaymentId(), status, description);
    }

    private void recordWithdrawalEvent(Long withdrawalId, TransactionStatus status,
                                       String description, String errorMessage) {
        log.info("환급 이벤트 기록: withdrawalId={}, status={}, description={}",
                withdrawalId, status, description);
    }
}
