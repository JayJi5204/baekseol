package com.example.backend.survey.scheduler;

import com.example.backend.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import static com.example.backend.survey.exception.SurveyErrorType.ERROR_PATCH_SURVEY_TO_DONE;

@Slf4j
@Component
@RequiredArgsConstructor
public class SurveyBatchScheduler {

    private final JobLauncher jobLauncher;
    private final Job surveyDeadlineJob;

    @Scheduled(cron = "0 30 0 * * *")
    public void runSurveyDeadlineBatch() {
        try {
            JobParameters jobParameters = new JobParametersBuilder()
                    .addLong("executeTime", System.currentTimeMillis())
                    .toJobParameters();
            jobLauncher.run(surveyDeadlineJob, jobParameters);
        } catch (Exception e) {
            log.error("Survey batch execution failed", e);
            throw new CustomException(ERROR_PATCH_SURVEY_TO_DONE);
        }
    }
}
