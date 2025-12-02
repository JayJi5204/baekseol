package com.example.backend.global.security;

// 별도 설정 클래스 불필요

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final StringRedisTemplate redisTemplate;

    public void saveRefreshToken(Long userId, String token) {
        redisTemplate.opsForValue().set("RT:" + userId, token, 7, TimeUnit.DAYS);
    }

    public String getRefreshToken(Long userId) {
        return redisTemplate.opsForValue().get("RT:" + userId);
    }

    public void deleteRefreshToken(Long userId) {
        redisTemplate.delete("RT:" + userId);
    }

    public void saveLastLoginTime(Long userId) {
        redisTemplate.opsForValue().set("LLT:" + userId, LocalDateTime.now().toString(), Duration.ofDays(1));
    }

    public void deleteLastLoginTime(Long userId) {
        redisTemplate.delete("LLT:" + userId);
    }

    public void saveActiveSession(Long userId, String tokenId) {
        String key = "AS:" + userId;
        redisTemplate.opsForValue().set(key, tokenId, 10, TimeUnit.MINUTES);
    }

    public String getActiveSession(Long userId) {
        return redisTemplate.opsForValue().get("AS:" + userId);
    }

    public void deleteActiveSession(Long userId) {
        redisTemplate.delete("AS:" + userId);
    }

    public void saveFindPasswordToken(String token, Long userId) {
        String oldToken = redisTemplate.opsForValue().get("FPT_USER:" + userId);

        if (oldToken != null) {
            deleteFindPasswordToken(oldToken);
        }

        String key = "FPT:" + token;
        String userKey = "FPT_USER:" + userId;
        redisTemplate.opsForValue().set(key, String.valueOf(userId), 30, TimeUnit.MINUTES);
        redisTemplate.opsForValue().set(userKey, token, 30, TimeUnit.MINUTES);
    }


    public void deleteFindPasswordToken(String token) {
        redisTemplate.delete("FPT:" + token);
    }


    public String checkTokenAndGetUserId(String token) {
        return redisTemplate.opsForValue().get("FPT:" + token);
    }

    public void incrementSendEmailCount(String email) {
        String key = "SE:" + email;
        redisTemplate.opsForValue().increment(key);
    }

    public Boolean checkSendEmailCount(String email) {
        String key = "SE:" + email;
        int count = sendEmailCount(key);
        return count < 3;
    }

    public Integer sendEmailCount(String key) {
        String value = redisTemplate.opsForValue().get(key);

        if (value == null) {
            redisTemplate.opsForValue().set(key, "0", 24, TimeUnit.HOURS);
            return 0;
        } else {
            return Integer.parseInt(value);
        }
    }

    public void deleteSendEmailCount(String email) {
        String key = "SE:" + email;
        redisTemplate.delete(key);
    }

    public boolean checkMinutes(Long userId, Integer min) {

        String lastLoginTimeStr = redisTemplate.opsForValue().get("LLT:" + userId);
        if (lastLoginTimeStr == null) {
            return true;
        }

        try {
            LocalDateTime lastLoginTime = LocalDateTime.parse(lastLoginTimeStr);
            LocalDateTime now = LocalDateTime.now();

            Long minPass = Duration.between(lastLoginTime, now).toMinutes();
            return minPass >= min;
        } catch (Exception e) {
            return true;
        }
    }

    public boolean validSession(Long userId, String tokenId) {
        String activeTokenId = getActiveSession(userId);
        return activeTokenId != null && activeTokenId.equals(tokenId);
    }


}
