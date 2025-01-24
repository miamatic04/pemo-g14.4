package com.example.backend.dto;

import com.example.backend.model.Person;
import com.example.backend.model.Report;
import com.example.backend.enums.ReportReason;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportDTO {
    private String reporterEmail;
    private String reporterName;
    private LocalDateTime dateReported;
    private String note;
    private String reportedEmail;
    private String reportedName;
    private List<ReportReason> reportReasons;
    private int numOfWarnings;
    private int numOfDisciplinaryMeasures;
    private String reviewText;
    private Long shopId;
    private Long productId;
    private Long reportId;

    public ReportDTO(Report report) {
        this.reportId = report.getId();
        this.reporterEmail = report.getReporter().getEmail();
        this.reporterName = report.getReporter().getName();
        this.reportReasons = report.getReportReasons();
        this.dateReported = report.getDateReported();
        this.note = report.getNote();

        Person reportedUser;

        if(report.getReportedUser() != null) {
            reportedUser = report.getReportedUser();
        } else if(report.getReportedReview() != null) {
            reportedUser = report.getReportedReview().getAuthor();
        } else if(report.getReportedShop() != null) {
            reportedUser = report.getReportedShop().getShopOwner();
            this.shopId = report.getReportedShop().getId();
        } else {
            reportedUser = report.getReportedProductShop().getShop().getShopOwner();
            this.productId = report.getReportedProductShop().getId();
        }

        this.reportedEmail = reportedUser.getEmail();
        this.reportedName = reportedUser.getName();
        this.numOfWarnings = reportedUser.getWarnings().size();
        this.numOfDisciplinaryMeasures = reportedUser.getDisciplinaryMeasures().size();
        if(report.getReportedReview() != null) {
            this.reviewText = report.getReportedReview().getText();
        }
    }
}
