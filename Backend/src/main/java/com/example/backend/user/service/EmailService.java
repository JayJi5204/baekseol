package com.example.backend.user.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * 비밀번호 재설정 이메일 발송
     */
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("[백설] 비밀번호 재설정 안내");

            String content = buildPasswordResetEmailContent(resetLink);
            helper.setText(content, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("이메일 발송 실패", e);
        }
    }

    private String buildPasswordResetEmailContent(String resetLink) {
        return """
            <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; padding: 30px;">
                    <h2 style="color: #333;">비밀번호 재설정</h2>
                    <p>안녕하세요,</p>
                    <p>비밀번호 재설정을 요청하셨습니다.</p>
                    <p>아래 버튼을 클릭하여 새 비밀번호를 설정해주세요.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" 
                           style="display: inline-block; padding: 12px 30px; 
                                  background-color: #4CAF50; color: white; 
                                  text-decoration: none; border-radius: 5px; font-weight: bold;">
                            비밀번호 재설정하기
                        </a>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">
                        또는 아래 링크를 복사하여 브라우저에 붙여넣으세요:<br>
                        <a href="%s" style="color: #4CAF50;">%s</a>
                    </p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                    
                    <p style="color: #999; font-size: 12px;">
                        ※ 이 링크는 30분 동안만 유효합니다.<br>
                        ※ 요청하지 않으셨다면 이 메일을 무시하세요.<br>
                        ※ 본 메일은 발신 전용입니다.
                    </p>
                    
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">
                        백설 설문 플랫폼
                    </p>
                </div>
            </body>
            </html>
            """.formatted(resetLink, resetLink, resetLink);
    }
}