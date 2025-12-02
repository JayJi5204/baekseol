package com.example.backend.adminstatistics.repository;

import com.example.backend.adminstatistics.entity.DailyStatistics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyStatisticsRepository extends JpaRepository<DailyStatistics, Long> {

    Optional<DailyStatistics> findByStatDate(LocalDate statDate);

    List<DailyStatistics> findByStatDateBetweenOrderByStatDateAsc(LocalDate start, LocalDate end);
}
