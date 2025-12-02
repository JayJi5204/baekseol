package com.example.backend.user.dto.request;

import lombok.Data;

@Data
public class SendMailRequest {

    private String username;
    private String email;
}
