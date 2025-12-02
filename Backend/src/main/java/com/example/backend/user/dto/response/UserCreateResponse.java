package com.example.backend.user.dto.response;

import com.example.backend.global.enumType.WorkType;
import com.example.backend.user.entity.UserEntity;
import com.example.backend.user.enumType.Gender;
import com.example.backend.user.enumType.UserRole;
import lombok.Data;

@Data
public class UserCreateResponse {

    private String username;

    private String email;

    private Long age;

    private Gender gender;

    private WorkType workType;

    private UserRole userRole;

    private Boolean isDeleted;

    private Long point;

    public static UserCreateResponse from(UserEntity entity) {
        UserCreateResponse response = new UserCreateResponse();
        response.username = entity.getUsername();
        response.email = entity.getEmail();
        response.age = entity.getAge();
        response.gender = entity.getGender();
        response.workType = entity.getWorkType();
        response.userRole =entity.getUserRole();
        response.isDeleted = entity.getIsDeleted();
        response.point=entity.getPoint();
        response.workType=entity.getWorkType();
        return response;
    }

}
