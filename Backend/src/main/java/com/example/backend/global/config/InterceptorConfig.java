package com.example.backend.global.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class InterceptorConfig implements WebMvcConfigurer {

    private final SessionValidInterceptor interceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(interceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                        "/api/v1/users/signup",
                        "/api/v1/users/login",
                        "/api/v1/users/refresh",
                        "/api/v1/users/find/**",
                        "/api/v1/surveys",
                        "/api/v1/surveys/home/**",
                        "/api/v1/interests",
                        "/api/v1/data/**"
                );
    }

}
