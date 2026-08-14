package com.example.demo_prj_intern.dto.request;

import java.math.BigDecimal;

public class ProjectSearchRequest {
    private String keyword;      // Tìm theo tiêu đề hoặc mô tả
    private BigDecimal minBudget; // Ngân sách tối thiểu
    private BigDecimal maxBudget; // Ngân sách tối đa
    private Long categoryId;      // Danh mục bài tuyển dụng
    private Integer page = 0;     // Trang số bao nhiêu (mặc định trang 0)
    private Integer size = 10;    // Số lượng bài trên 1 trang
}
