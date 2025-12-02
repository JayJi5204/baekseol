package com.example.backend.user.serviceImpl;

import com.example.backend.global.exception.DuplicateFieldException;
import com.example.backend.global.exception.FindAccountException;
import com.example.backend.global.exception.LoginFailedException;
import com.example.backend.global.security.TokenProvider;
import com.example.backend.global.security.TokenService;
import com.example.backend.user.dto.request.*;
import com.example.backend.user.dto.response.*;
import com.example.backend.user.entity.UserEntity;
import com.example.backend.user.repository.UserRepository;
import com.example.backend.user.service.EmailService;
import com.example.backend.user.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TokenProvider tokenProvider;
    private final PasswordEncoder encoder;
    private final TokenService tokenService;
    private final EmailService emailService;

    @Transactional
    @Override
    public UserCreateResponse create(UserCreateRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateFieldException("username", "이미 존재하는 닉네임입니다.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateFieldException("email", "이미 등록된 이메일입니다.");
        }

        UserEntity entity = userRepository.save(
                UserEntity.create(request.getUsername(), request.getEmail(), encoder.encode(request.getPassword()), request.getAge(), request.getGender(), request.getWorkType())
        );
        return UserCreateResponse.from(entity);
    }

    @Override
    public LoginResponse login(LoginRequest request, HttpServletResponse response) {
        UserEntity entity = checkUsernameAndPassword(
                request.getUsername(),
                request.getPassword()
        );

        if (entity == null) {
            throw new LoginFailedException("username", "Invalid nickname or password");
        }

        String accessToken = tokenProvider.createAccessToken(entity);
        String refreshToken = tokenProvider.createRefreshToken(entity);

        Long userId = Long.parseLong(tokenProvider.validateAndGetUserId(accessToken));
        String tokenId = tokenProvider.getTokenId(accessToken);

        tokenService.saveRefreshToken(entity.getId(), refreshToken);
        tokenService.saveLastLoginTime(entity.getId());
        tokenService.saveActiveSession(userId, tokenId);
        response.addCookie(createCookie("refreshToken", refreshToken));

        return LoginResponse.from(entity, accessToken);
    }

    @Override
    public RefreshTokenResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("유효하지 않은 Refresh Token");
        }

        String userId = tokenProvider.validateAndGetUserId(refreshToken);
        String storedRefreshToken = tokenService.getRefreshToken(Long.parseLong(userId));

        if (storedRefreshToken == null || !storedRefreshToken.equals(refreshToken)) {
            throw new RuntimeException("Refresh Token이 유효하지 않습니다. 다시 로그인 해주세요.");
        }

        UserEntity user = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = tokenProvider.createAccessToken(user);

        String newTokenId = tokenProvider.getTokenId(newAccessToken);
        tokenService.saveActiveSession(Long.parseLong(userId), newTokenId);
        
        return RefreshTokenResponse.from(newAccessToken);
    }


    @Override
    public UserInfoResponse userInfo(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        UserEntity user = userRepository.findById(userId)
                .orElseThrow();
        return UserInfoResponse.from(user);
    }

    @Transactional
    @Override
    public UserDeleteResponse delete(Authentication authentication, HttpServletResponse response) {
        Long userId = Long.parseLong(authentication.getName());
        UserEntity user = userRepository.findById(userId)
                .orElseThrow();
        if (user == null) {
            throw new RuntimeException("유효하지 않은 사용자이거나 이미 탈퇴한 계정입니다.");
        }
        user.delete();
        response.addCookie(deleteCookie());
        return UserDeleteResponse.from(user);
    }

    @Transactional
    @Override
    public UserUpdateResponse update(UserUpdateRequest request, Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다."));

        // ✅ 닉네임 중복 검사 (본인 제외)
        if (userRepository.existsByUsername(request.getUsername())
                && !user.getUsername().equals(request.getUsername())) {
            throw new DuplicateFieldException("username", "이미 존재하는 닉네임입니다.");
        }

        // ✅ 이메일 중복 검사 (본인 제외)
        if (userRepository.existsByEmail(request.getEmail())
                && !user.getEmail().equals(request.getEmail())) {
            throw new DuplicateFieldException("email", "이미 존재하는 이메일입니다.");
        }

        // ✅ 비밀번호 null 또는 공백일 경우 기존 비밀번호 유지
        String encodedPassword;
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            encodedPassword = user.getPassword();
        } else {
            encodedPassword = encoder.encode(request.getPassword());
        }

        user.update(
                request.getUsername(),
                encodedPassword,
                request.getEmail(),
                request.getWorkType()
        );

        return UserUpdateResponse.from(user);
    }

    @Override
    public LogoutResponse logout(Authentication authentication, HttpServletResponse response) {
        Long userId = Long.parseLong(authentication.getName());
        tokenService.deleteRefreshToken(userId);
        tokenService.deleteLastLoginTime(userId);
        tokenService.deleteActiveSession(userId);
        response.addCookie(deleteCookie());
        return LogoutResponse.from(userId);
    }

    @Override
    public boolean verifyPasswordAndUpdateTime(Long userId, String password) {
        UserEntity entity = userRepository.findById(userId).orElseThrow();

        if (!encoder.matches(password, entity.getPassword())) {
            return false;
        }

        tokenService.saveLastLoginTime(userId);

        return true;
    }

    @Override
    public CheckPasswordResponse checkPassword(Authentication authentication, CheckPasswordRequest request) {
        Long userId = Long.parseLong(authentication.getName());

        UserEntity entity = userRepository.findUserById(userId);
        if (entity == null) {
            return CheckPasswordResponse.fail("사용자를 찾을 수 없습니다.");
        }

        if (!tokenService.checkMinutes(userId, 10)) {
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return CheckPasswordResponse.fail("비밀번호를 입력해주세요");
            }

            if (!verifyPasswordAndUpdateTime(userId, request.getPassword())) {
                return CheckPasswordResponse.fail("비밀번호가 일치하지 않습니다.");
            }
        }
        return CheckPasswordResponse.success();
    }

    @Override
    public SendMailResponse sendMailForFindPassword(SendMailRequest request) {

        UserEntity entity = userRepository.findByUsernameAndEmail(request.getUsername(), request.getEmail());

        if (entity == null || entity.getIsDeleted()) {
            return SendMailResponse.userFail();
        }

        if (!tokenService.checkSendEmailCount(request.getEmail())) {
            return SendMailResponse.countFail();
        }

        String token = UUID.randomUUID().toString();

        tokenService.saveFindPasswordToken(token, entity.getId());

        String resetLink = "http://www.baekseol.site/users/reset?token=" + token;

        emailService.sendPasswordResetEmail(entity.getEmail(), resetLink);

        tokenService.incrementSendEmailCount(request.getEmail());

        return SendMailResponse.success(entity, token);
    }


    @Override
    public FindIdResponse findId(FindIdRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            throw new FindAccountException("username", "사용자 아이디가 없습니다");
        }
        return FindIdResponse.from(user);
    }

    @Override
    public CheckTokenResponse checkToken(String token) {
        try {
            String stringUserId = tokenService.checkTokenAndGetUserId(token);
            Long userId = Long.parseLong(stringUserId);
            return CheckTokenResponse.success(userId);
        } catch (Exception e) {
            return CheckTokenResponse.fail();
        }
    }

    @Transactional
    @Override
    public FindPasswordResponse findPassword(FindPasswordRequest request) {

        CheckTokenResponse response = checkToken(request.getToken());
        UserEntity entity = userRepository.findUserById(response.getUserId());
        entity.updatePassword(encoder.encode(request.getNewPassword()));
        tokenService.deleteFindPasswordToken(request.getToken());
        return FindPasswordResponse.from(entity);
    }

    private UserEntity checkUsernameAndPassword(String username, String password) {
        UserEntity entity = userRepository.findByUsername(username);

        if (entity == null || entity.getIsDeleted()) {
            throw new LoginFailedException("username", "존재하지 않는 사용자입니다.");
        }

        if (!encoder.matches(password, entity.getPassword())) {
            throw new LoginFailedException("password", "비밀번호가 일치하지 않습니다.");
        }

        return entity;
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(7 * 24 * 60 * 60);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        return cookie;
    }

    private Cookie deleteCookie() {
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        return cookie;
    }

}
