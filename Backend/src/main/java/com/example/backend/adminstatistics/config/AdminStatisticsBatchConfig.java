package com.example.backend.adminstatistics.config;

import com.example.backend.adminstatistics.dto.DailyStatisticsDTO;
import com.example.backend.adminstatistics.entity.DailyStatistics;
import com.example.backend.adminstatistics.processor.AdminStatisticsProcessor;
import com.example.backend.adminstatistics.reader.AdminStatisticsReader;
import com.example.backend.adminstatistics.writer.AdminStatisticsWriter;

// 필수 Spring Batch import
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class AdminStatisticsBatchConfig {

    @Bean
    public Job dailyStatisticsJob(JobRepository jobRepository, Step dailyStatisticsStep) {
        return new JobBuilder("dailyStatisticsJob", jobRepository)
                .start(dailyStatisticsStep)
                .build();
    }

    @Bean
    public Step dailyStatisticsStep(JobRepository jobRepository,
                                    PlatformTransactionManager transactionManager,
                                    ItemReader<DailyStatisticsDTO> reader,
                                    ItemProcessor<DailyStatisticsDTO, DailyStatistics> processor,
                                    ItemWriter<DailyStatistics> writer) {
        return new StepBuilder("dailyStatisticsStep", jobRepository)
                .<DailyStatisticsDTO, DailyStatistics>chunk(10, transactionManager)
                .reader(reader)
                .processor(processor)
                .writer(writer)
                .build();
    }

    public ItemReader<DailyStatisticsDTO> reader() {
        return new AdminStatisticsReader();
    }

    public ItemProcessor<DailyStatisticsDTO, DailyStatistics> processor() {
        return new AdminStatisticsProcessor();
    }

    public ItemWriter<DailyStatistics> writer() {
        return new AdminStatisticsWriter();
    }

}
