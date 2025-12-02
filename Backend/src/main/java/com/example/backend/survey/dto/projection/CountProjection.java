package com.example.backend.survey.dto.projection;

/* 통게 그룹 집계용 인터페이스 */
public interface CountProjection {
    Object getCategory();

    Long getCount();
}
