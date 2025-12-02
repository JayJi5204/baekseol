package com.example.backend.user.entity;

import com.example.backend.global.common.BaseTimeEntity;
import com.example.backend.global.enumType.WorkType;
import com.example.backend.user.enumType.Gender;
import com.example.backend.user.enumType.UserRole;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class UserEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    private Long age;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private WorkType workType;

    @Setter
    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    private Boolean isDeleted;

    private Long point;


    public static UserEntity create(String username, String email, String password, Long age, Gender gender, WorkType workType) {
        UserEntity member = new UserEntity();
        member.username = username;
        member.email = email;
        member.password = password;
        member.age = age;
        member.gender = gender;
        member.userRole = UserRole.USER;
        member.isDeleted = false;
        member.point=0L;
        member.workType=workType;
        return member;
    }

    public void delete() {
        this.isDeleted = true;
    }
    //포인트 증가
    public void chargePoint(Long amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("포인트는 0 이상이어야 합니다");
        }
        this.point += amount;
    }

    // 포인트 사용
    public void usePoint(Long amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("포인트는 0 이상이어야 합니다");
        }
        if (this.point < amount) {
            throw new IllegalArgumentException("포인트 부족");
        }
        this.point -= amount;
    }

    public void update(String username, String password, String email, WorkType workType) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.workType = workType;
    }

    public void updatePassword(String password){
        this.password=password;
    }

}
