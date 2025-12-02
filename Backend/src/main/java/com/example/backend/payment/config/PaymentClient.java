package com.example.backend.payment.config;

import com.nimbusds.jose.EncryptionMethod;
import com.nimbusds.jose.JWEAlgorithm;
import com.nimbusds.jose.JWEHeader;
import com.nimbusds.jose.JWEObject;
import com.nimbusds.jose.crypto.DirectDecrypter;
import com.nimbusds.jose.crypto.DirectEncrypter;
import io.netty.channel.ChannelOption;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;
import reactor.netty.resources.ConnectionProvider;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.UUID;

@Component
@Slf4j
public class PaymentClient {

    private static final int CONNECT_TIMEOUT_MILLIS = 3000;
    private static final int READ_TIMEOUT_MILLIS = 30000;

    private final WebClient webClient;
    private final PaymentProperties paymentProperties;

    public PaymentClient(PaymentProperties paymentProperties) {
        this.paymentProperties = paymentProperties;

        String basicAuth = createBasicAuth(paymentProperties.getSecretKey());

        HttpClient httpClient = HttpClient.create(
                        ConnectionProvider.builder("custom")
                                .maxConnections(100)
                                .maxIdleTime(Duration.ofSeconds(20))
                                .build()
                )
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, CONNECT_TIMEOUT_MILLIS)
                .responseTimeout(Duration.ofMillis(READ_TIMEOUT_MILLIS));

        ReactorClientHttpConnector connector = new ReactorClientHttpConnector(httpClient);

        this.webClient = WebClient.builder()
                .baseUrl(paymentProperties.getBaseUrl())
                .clientConnector(connector)
                .defaultHeader(HttpHeaders.AUTHORIZATION, basicAuth)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    private String createBasicAuth(String secretKey) {
        byte[] encodedBytes = Base64.getEncoder().encode(
                (secretKey + ":").getBytes(StandardCharsets.UTF_8)
        );
        return "Basic " + new String(encodedBytes);
    }

    // ✅ 결제 확인 API - String으로 먼저 받아서 파싱
    public JSONObject confirmPayment(JSONObject body) {
        log.info("🔍 토스 결제 확인 요청: {}", body.toJSONString());

        try {
            String responseStr = webClient.post()
                    .uri("/v1/payments/confirm")
                    .bodyValue(body.toJSONString())
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, response ->
                            response.bodyToMono(String.class)
                                    .flatMap(errorBody -> {
                                        log.error("❌ 토스 API 에러 응답: {}", errorBody);
                                        return Mono.error(new RuntimeException("결제 실패: " + errorBody));
                                    }))
                    .bodyToMono(String.class)
                    .block();

            log.info("📦 토스 원본 응답: {}", responseStr);

            if (responseStr == null || responseStr.trim().isEmpty()) {
                log.error("응답이 비어있습니다. baseUrl 확인: {}", paymentProperties.getBaseUrl());
                throw new RuntimeException("토스 API 응답이 비어있습니다");
            }

            // JSON 파싱
            JSONObject json = (JSONObject) new JSONParser().parse(responseStr);
            log.info("✅ 토스 API 성공 응답: {}", json.toJSONString());
            return json;

        } catch (Exception e) {
            log.error("결제 확인 실패: {}", e.getMessage(), e);
            throw new RuntimeException("결제 확인 실패: " + e.getMessage(), e);
        }
    }


    // ✅ 지급대행 요청 (암호화/복호화)
    public JSONObject payoutPayment(JSONObject body) {
        log.info("🔍 토스 지급대행 요청: {}", body.toJSONString());

        String encryptedBody = encryptJWE(body);

        try {
            String responseStr = webClient.post()
                    .uri("/v2/payouts")
                    .header("TossPayments-api-security-mode", "ENCRYPTION")
                    .header("Idempotency-Key", UUID.randomUUID().toString())
                    .bodyValue(encryptedBody)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, response ->
                            response.bodyToMono(String.class)
                                    .flatMap(errorBody -> {
                                        log.error("❌ 지급대행 에러 응답: {}", errorBody);
                                        return Mono.error(new RuntimeException("지급대행 실패: " + errorBody));
                                    }))
                    .bodyToMono(String.class)
                    .block();

            if (responseStr == null || responseStr.isEmpty()) {
                throw new RuntimeException("지급대행 응답이 비어있습니다");
            }

            log.info("📦 원본 응답: {}", responseStr.substring(0, Math.min(100, responseStr.length())));

            // ✅ 응답 복호화
            String decryptedResponse = decrypt(responseStr);
            JSONObject json = (JSONObject) new JSONParser().parse(decryptedResponse);

            log.info("✅ 지급대행 성공: {}", json.toJSONString());
            return json;

        } catch (Exception e) {
            log.error("❌ 지급대행 오류: {}", e.getMessage(), e);
            throw new RuntimeException("지급대행 실패: " + e.getMessage(), e);
        }
    }

    // ✅ 응답 복호화 메서드
    private String decrypt(String encryptedTarget) throws Exception {
        byte[] key = hexToBytes(paymentProperties.getSecurityKey());
        JWEObject jweObject = JWEObject.parse(encryptedTarget);
        jweObject.decrypt(new DirectDecrypter(key));

        if (jweObject.getState() == JWEObject.State.DECRYPTED) {
            return jweObject.getPayload().toString();
        } else {
            throw new RuntimeException("복호화 실패");
        }
    }

    // ✅ JWE 암호화
    private String encryptJWE(JSONObject body) {
        try {
            byte[] securityKeyBytes = hexToBytes(paymentProperties.getSecurityKey());

            JWEObject jweObject = new JWEObject(
                    new JWEHeader.Builder(JWEAlgorithm.DIR, EncryptionMethod.A256GCM)
                            .contentType("application/json")
                            .build(),
                    new com.nimbusds.jose.Payload(body.toJSONString())
            );

            jweObject.encrypt(new DirectEncrypter(securityKeyBytes));
            return jweObject.serialize();

        } catch (Exception e) {
            log.error("JWE 암호화 실패: {}", e.getMessage());
            throw new RuntimeException("JWE 암호화 실패", e);
        }
    }

    // ✅ Hex to Bytes 변환
    private byte[] hexToBytes(String hex) {
        byte[] bytes = new byte[hex.length() / 2];
        for (int i = 0; i < hex.length(); i += 2) {
            bytes[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                    + Character.digit(hex.charAt(i+1), 16));
        }
        return bytes;
    }
}
