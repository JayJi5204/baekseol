package com.example.backend.adminstatistics.scheduler;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
public class AdminStatisticsScheduler {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job dailyStatisticsJob;

    @Scheduled(cron = "0 0 3 * * *")  // 매일 새벽 3시 실행
    public void runDailyStatisticsJob() throws Exception {
        jobLauncher.run(dailyStatisticsJob,
                new JobParametersBuilder()
                        .addLong("time", System.currentTimeMillis())
                        .toJobParameters());
    }
}
