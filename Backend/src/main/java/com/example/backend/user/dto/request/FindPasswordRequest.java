package com.example.backend.user.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class FindPasswordRequest {

    private String token;
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$",
            message = "비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다."
    )
    private String newPassword;
}
