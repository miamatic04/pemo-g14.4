package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.awt.desktop.UserSessionEvent;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendWarningDTO {
    private Long reportId;
    private String warnedUserEmail;
    private String note;
    private List<ReportReason> approvedReasons;
}
