package com.example.backend.interest.service;

import com.example.backend.global.exception.CustomException;
import com.example.backend.interest.dto.response.InterestResDto;
import com.example.backend.interest.entity.Interest;
import com.example.backend.interest.repository.InterestRepository;
import com.example.backend.survey.entity.UserSurvey;
import com.example.backend.survey.repository.UserSurveyRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.example.backend.interest.exception.InterestErrorType.ERROR_GET_INTEREST;

@AllArgsConstructor
@Service
public class InterestService {

    private final InterestRepository interestRepository;
    private final UserSurveyRepository userSurveyRepository;

    // 단일 관심사 조회
    public Interest getInterest(Long interestId) {
        return interestRepository.findById(interestId).orElseThrow(() -> new CustomException(ERROR_GET_INTEREST));
    }

    // 나의 관심사 조회 (상위 3개)
    public List<Interest> getInterestByUserId(Long userId) {
        List<UserSurvey> userSurveys = userSurveyRepository.findByUserIdWithInterestAndSurvey(userId);
        if (userSurveys.isEmpty()) return List.of();

        return userSurveys.stream()
                .map(UserSurvey::getInterest)
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<Interest, Long>comparingByValue().reversed())
                .limit(3)
                .map(Map.Entry::getKey)
                .toList();
    }

    public List<InterestResDto> getAllInterests() {
        List<Interest> interests = interestRepository.findAll();
        return interests.stream()
                .map(InterestResDto::from)
                .toList();
    }
}
