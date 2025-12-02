package com.example.backend.point.enumType;

public enum PointType {
    GET("포인트 획득"),
    USE("포인트 사용");
    
    private final String description;
    
    PointType(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
