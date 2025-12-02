package com.example.backend.user.dto.response;

import com.example.backend.global.enumType.WorkType;
import com.example.backend.user.entity.UserEntity;
import com.example.backend.user.enumType.Gender;
import lombok.Data;

@Data
public class UserUpdateResponse {

    private String username;

    private String email;

    private Long age;

    private Gender gender;

    private WorkType workType;


    private Boolean isDeleted;

    private Long point;

    public static UserUpdateResponse from(UserEntity entity) {
        UserUpdateResponse response = new UserUpdateResponse();
        response.username = entity.getUsername();
        response.email = entity.getEmail();
        response.age = entity.getAge();
        response.gender = entity.getGender();
        response.workType = entity.getWorkType();
        response.isDeleted = entity.getIsDeleted();
        response.point = entity.getPoint();
        return response;
    }
}
