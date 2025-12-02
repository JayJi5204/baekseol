package com.example.backend.user.dto.response;

import com.example.backend.global.enumType.WorkType;
import com.example.backend.user.entity.UserEntity;
import com.example.backend.user.enumType.Gender;
import com.example.backend.user.enumType.UserRole;
import lombok.Data;

@Data
public class UserInfoResponse {
    private Long id;
    private String username;
    private String email;
    private Long age;
    private Gender gender;
    private WorkType workType;
    private Long point;
    private UserRole role;  // 역할 필드 추가

    public static UserInfoResponse from(UserEntity entity) {
        UserInfoResponse response=new UserInfoResponse();
        response.id=entity.getId();
        response.username = entity.getUsername();
        response.email=entity.getEmail();
        response.age= entity.getAge();
        response.gender=entity.getGender();
        response.workType=entity.getWorkType();
        response.point=entity.getPoint();
        response.role=entity.getUserRole();
        return  response;

    }
}
