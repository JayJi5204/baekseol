package com.example.backend.global.security;

import com.example.backend.user.entity.UserEntity;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.UUID;

@Service
public class TokenProvider {

    private final Key SIGNING_KEY;

    private final long ACCESS_TOKEN_EXPIRE_TIME = 1000 * 60 * 10;   // 10분
    private final long REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 14;     // 14일

    public TokenProvider(@Value("${jwt.secret}") String secretKey) {
        this.SIGNING_KEY = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String createAccessToken(UserEntity entity) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + ACCESS_TOKEN_EXPIRE_TIME);

        return Jwts.builder()
                .signWith(SIGNING_KEY, SignatureAlgorithm.HS512)
                .setSubject(String.valueOf(entity.getId()))
                .setId(UUID.randomUUID().toString())
                .claim("nickname", entity.getUsername())
                .claim("role", entity.getUserRole())
                .setIssuer("100seol app")
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .compact();
    }

    public String createRefreshToken(UserEntity entity) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + REFRESH_TOKEN_EXPIRE_TIME);

        return Jwts.builder()
                .signWith(SIGNING_KEY, SignatureAlgorithm.HS512)
                .setSubject(String.valueOf(entity.getId()))
                .setId(UUID.randomUUID().toString())
                .setIssuer("100seol app")
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(SIGNING_KEY)
                    .build()
                    .parseClaimsJws(token);
            return true;  // 유효한 토큰
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("토큰이 만료되었습니다.");
        } catch (JwtException e) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }
    }

    public String validateAndGetUserId(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SIGNING_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("토큰이 만료되었습니다.");
        } catch (JwtException e) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }
    }

    public String getTokenId(String token) {
        try {
            Claims claims=Jwts.parserBuilder()
                    .setSigningKey(SIGNING_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getId();

        } catch (ExpiredJwtException e) {
            throw new RuntimeException("토큰이 만료되었습니다.");
        } catch (JwtException e) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }
    }
}
