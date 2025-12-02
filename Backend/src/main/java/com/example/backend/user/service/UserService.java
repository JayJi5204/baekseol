package com.example.backend.user.service;

import com.example.backend.user.dto.request.*;
import com.example.backend.user.dto.response.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;

public interface UserService {

    UserCreateResponse create(UserCreateRequest request);

    LoginResponse login(LoginRequest request, HttpServletResponse response);

    RefreshTokenResponse refreshToken(String refreshToken);

    UserInfoResponse userInfo(Authentication authentication);

    UserDeleteResponse delete(Authentication authentication,HttpServletResponse response);

    UserUpdateResponse update(UserUpdateRequest request, Authentication authentication);

    LogoutResponse logout(Authentication authentication, HttpServletResponse response);

    FindIdResponse findId(FindIdRequest request);

    SendMailResponse sendMailForFindPassword(SendMailRequest request);

    CheckTokenResponse checkToken(String token);

    FindPasswordResponse findPassword(FindPasswordRequest request);

    boolean verifyPasswordAndUpdateTime(Long userId,String password);

    CheckPasswordResponse checkPassword(Authentication authentication, CheckPasswordRequest request);
}
