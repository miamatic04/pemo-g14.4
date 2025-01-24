package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddReportDTO {
    private String note;
    private String reportedUserEmail;
    private Long reportedReviewId;
    private Long reportedShopId;
    private Long reportedProductId;
    private List<String> reportReasons;
}
