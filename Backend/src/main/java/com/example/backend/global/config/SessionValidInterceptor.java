package com.example.backend.global.config;

import com.example.backend.global.security.TokenProvider;
import com.example.backend.global.security.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Log4j2
@Component
@RequiredArgsConstructor
public class SessionValidInterceptor implements HandlerInterceptor {

    private final TokenProvider tokenProvider;
    private final TokenService tokenService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return sendError(response, "인증 토큰이 필요합니다.");
        }

        String token = authHeader.substring(7);

        try {
            String userId = tokenProvider.validateAndGetUserId(token);
            String tokenId = tokenProvider.getTokenId(token);

            if (!tokenService.validSession(Long.parseLong(userId), tokenId)) {
                return sendError(response, "다른 기기에서 로그인되었습니다.");
            }

            return true;

        } catch (RuntimeException e) {
            return sendError(response, e.getMessage());
        }
    }

    private boolean sendError(HttpServletResponse response, String message) throws Exception {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(String.format("{\"error\": \"%s\"}", message));
        return false;
    }
}