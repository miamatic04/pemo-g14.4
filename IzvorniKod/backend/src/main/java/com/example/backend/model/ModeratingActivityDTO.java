package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModeratingActivityDTO {
    private LocalDateTime dateTime;
    private String moderatorEmail;
    private String moderatorName;
    private String userEmail;
    private String userName;
    private String note;
    private List<ReportReason> approvedReasons;
    private boolean warning;
    private MeasureType disciplinaryMeasure;
    private Long reportId;
    private boolean ignored;
}
