package com.example.backend.user.repository;

import com.example.backend.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    UserEntity findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    // 오늘 가입자 수 조회 (현재 날짜 기준)
    @Query("SELECT COUNT(u) FROM UserEntity u WHERE DATE(u.createdAt) = CURRENT_DATE")
    Long countByCreatedAtDate(LocalDate date);
    UserEntity findByEmail(String email);
    UserEntity findByUsernameAndEmail(String username,String email);
    @Query("SELECT u FROM UserEntity u WHERE u.id = :id")
    UserEntity findUserById(@Param("id") Long id);
}
