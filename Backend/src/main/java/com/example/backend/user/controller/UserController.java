package com.example.backend.user.controller;

import com.example.backend.user.dto.request.*;
import com.example.backend.user.dto.response.*;
import com.example.backend.user.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService service;

    //jwt test
    @GetMapping("/userinfo")
    public UserInfoResponse userInfo(Authentication authentication) {
        return service.userInfo(authentication);
    }

    @PostMapping("/signup")
    public UserCreateResponse signup(@RequestBody UserCreateRequest request) {
        return service.create(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request, HttpServletResponse response) {
        return service.login(request, response);
    }

    @PostMapping("/logout")
    public LogoutResponse logout(Authentication authentication,HttpServletResponse response) {
        return service.logout(authentication,response);
    }

    @PostMapping("/refresh")
    public RefreshTokenResponse refreshToken(
            @CookieValue(value = "refreshToken",required = false) String refreshToken
    ) {
        if (refreshToken == null) {
            throw new RuntimeException("RefreshToken이 없습니다. 다시 로그인 해주세요.");
        }
        return service.refreshToken(refreshToken);
    }


    @DeleteMapping("/delete")
    public UserDeleteResponse delete(Authentication authentication,HttpServletResponse response) {
        return service.delete(authentication,response);
    }

    @PutMapping("/update")
    public UserUpdateResponse update(@RequestBody UserUpdateRequest request, Authentication authentication){
        return service.update(request,authentication);
    }

    @PostMapping ("/check/password")
    public CheckPasswordResponse checkPassword(Authentication authentication,@RequestBody CheckPasswordRequest request) {
        return service.checkPassword(authentication,request);
    }

    @PostMapping("/find/id")
    public FindIdResponse findId(@RequestBody FindIdRequest request){
        return service.findId(request);
    }

    @PostMapping("/find/sendMail")
    public SendMailResponse sendMail(@RequestBody SendMailRequest request){
        return service.sendMailForFindPassword(request);
    }

    @GetMapping("/find/checkToken")
    public CheckTokenResponse verifyResetToken(@RequestParam String token) {
        return service.checkToken(token);
    }

    @PostMapping("/find/password")
    public FindPasswordResponse findPassword(@RequestBody FindPasswordRequest request){
        return service.findPassword(request);
    }
}
