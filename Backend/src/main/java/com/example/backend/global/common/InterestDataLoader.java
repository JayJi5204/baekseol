package com.example.backend.global.common;

import com.example.backend.interest.entity.Interest;
import com.example.backend.interest.repository.InterestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class InterestDataLoader {

    @Bean
    @Order(1)
    public CommandLineRunner loadInitialData(InterestRepository interestRepository) {
        return args -> {
            log.info(">>> InterestDataLoader 시작");

            long count = interestRepository.count();
            log.info(">>> 현재 Interest 개수: {}", count);

            if (count > 0) {
                log.info("관심사가 이미 존재합니다. 스킵!");
                return;
            }

            log.info("===== 초기 마스터 데이터 생성 시작 =====");

            List<String> interestContents = List.of(
                    "스포츠", "음식", "영화", "여행", "음악",
                    "독서", "게임", "패션", "반려동물", "IT/기술",
                    "사진", "요리", "미술", "건강", "자동차"
            );

            log.info(">>> Interest 객체 생성 시작 ({}개)", interestContents.size());

            List<Interest> interests = new ArrayList<>();
            for (String content : interestContents) {
                Interest interest = new Interest();
                interest.setContent(content);
                interests.add(interest);
                log.debug("Interest 생성: {}", content);
            }

            log.info(">>> Interest 객체 생성 완료. saveAll() 호출 전");

            try {
                List<Interest> savedInterests = interestRepository.saveAll(interests);
                log.info(">>> saveAll() 완료! 저장된 개수: {}", savedInterests.size());

                // 저장된 데이터 확인
                for (Interest saved : savedInterests) {
                    log.info("  저장 완료 - ID: {}, Content: {}", saved.getInterestId(), saved.getContent());
                }

            } catch (Exception e) {
                log.error("❌ saveAll() 실행 중 에러 발생!", e);
                throw e;
            }

            log.info("===== 초기 마스터 데이터 생성 완료 =====");
        };
    }
}