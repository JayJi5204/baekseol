package com.example.backend.global.enumType;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum WorkType {
    IT("IT/개발"),
    OFFICE("사무/관리직"),              // 금융, 인사, 법률, 회계, 컨설팅 등
    MANUFACTURING("제조/건설"),          // 제조, 건설 통합
    SERVICE("서비스/판매"),             // 서비스, 영업/판매, 물류, 호텔 통합
    EDUCATION("교육"),
    MEDICAL("의료"),
    CREATIVE("창작/디자인/미디어"),      // 디자인, 마케팅, 미디어 통합
    STUDENT("학생"),
    SELF_EMPLOYED("프리랜서/자영업"),   // 프리랜서, 자영업 통합
    ETC("기타");                        // 공무원, 농업, 무직 등 나머지

    private final String displayName;
}