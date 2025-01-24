package com.example.backend.controller;

import com.example.backend.dto.AddReportDTO;
import com.example.backend.dto.ReportDTO;
import com.example.backend.dto.SendWarningDTO;
import com.example.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping("/sendReport")
    public ResponseEntity<String> sendReport(@RequestBody AddReportDTO addReportDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(reportService.createReport(addReportDTO, authHeader.substring(7)));
    }

    @GetMapping("/getShopReports")
    public ResponseEntity<List<ReportDTO>> getShopReports() {
        return ResponseEntity.ok(reportService.getShopReports());
    }

    @GetMapping("/getProductReports")
    public ResponseEntity<List<ReportDTO>> getProductReports() {
        return ResponseEntity.ok(reportService.getProductReports());
    }

    @GetMapping("/getUserReports")
    public ResponseEntity<List<ReportDTO>> getUserReports() {
        return ResponseEntity.ok(reportService.getUserReports());
    }

    @GetMapping("/getReviewReports")
    public ResponseEntity<List<ReportDTO>> getReviewReports() {
        return ResponseEntity.ok(reportService.getReviewReports());
    }

    @PostMapping("/ignoreReport")
    public ResponseEntity<String> ignoreReport(@RequestBody SendWarningDTO sendWarningDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(reportService.ignoreReport(sendWarningDTO, authHeader.substring(7)));
    }
}
