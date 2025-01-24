package com.example.backend.dto;

import com.example.backend.enums.ReportReason;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SendDcMeasureDTO {
    private Long reportId;
    private String disciplinedUserEmail;
    private String note;
    private String type;
    private List<ReportReason> approvedReasons;
}
