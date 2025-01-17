package com.example.backend.service;

import com.example.backend.exception.*;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private JWTService jwtService;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private ProductShopRepository productShopRepository;
    @Autowired
    private ShopRepository shopRepository;

    public String createReport(AddReportDTO addReportDTO, String token) {

        String email = jwtService.extractUsername(token);

        Person reporter = personRepository.findByEmail(email);

        if(reporter == null) {
            throw new UserNotFoundException("User (reporter) not found");
        }

        try {
            for(String reportReason : addReportDTO.getReportReasons()) {
                ReportReason.valueOf(reportReason);
            }
        } catch (IllegalArgumentException e) {
            throw new InvalidReportReasonException("Invalid report reason");
        }

        Review reportedReview = null;
        Shop reportedShop = null;
        Person reportedUser = null;
        ProductShop reportedProduct = null;

        boolean flag1, flag2, flag3, flag4;

        flag1 = false;
        flag2 = false;
        flag3 = false;
        flag4 = false;

        if(addReportDTO.getReportedReviewId() != null) {
            reportedReview = reviewRepository.findById(addReportDTO.getReportedReviewId()).orElseThrow(() -> new ReviewNotFoundException("Review not found"));
            flag1 = true;
        }
        if(addReportDTO.getReportedProductId() != null) {
            reportedProduct = productShopRepository.findById(addReportDTO.getReportedProductId()).orElseThrow(() -> new ProductNotFoundException("Product not found"));
            flag2 = true;
        }
        if(addReportDTO.getReportedShopId() != null) {
            reportedShop = shopRepository.findById(addReportDTO.getReportedShopId()).orElseThrow(() -> new ShopNotFoundException("Shop not found"));
            flag3 = true;
        }
        if(addReportDTO.getReportedUserEmail() != null) {
            reportedUser = personRepository.findByEmail(addReportDTO.getReportedUserEmail());
            flag4 = true;
        }

        if((flag1 && flag2) || (flag1 && flag3) || (flag1 && flag4) || (flag2 && flag3) || (flag3 && flag4) || (!flag1 && !flag2 && !flag3 && !flag4)) {
            throw new IllegalReportFormatException("Report must be towards one and only one of the following: shop, product, user, review.");
        }

        Report report = new Report();

        if(flag1) {
            report.setReportedReview(reportedReview);
        }

        if(flag2) {
            report.setReportedProductShop(reportedProduct);
        }

        if(flag3) {
            report.setReportedShop(reportedShop);
        }

        if(flag4) {
            report.setReportedUser(reportedUser);
        }

        report.setNote(addReportDTO.getNote());
        report.setReporter(reporter);

        List<ReportReason> validReportReasons = addReportDTO.getReportReasons().stream()
                .filter(this::isValidEnum)
                .map(ReportReason::valueOf)
                .collect(Collectors.toList());

        report.setReportReasons(validReportReasons);
        report.setDateReported(LocalDateTime.now());

        reporter.getSentReports().add(report);

        personRepository.save(reporter);

        return "Report sent successfully";
    }

    private boolean isValidEnum(String value) {
        try {
            ReportReason.valueOf(value);
            return true;
        } catch (IllegalArgumentException e) {
            throw new InvalidReportReasonException("Invalid report reason");
        }
    }

    public List<ReportDTO> getShopReports() {

        List<Report> reports = reportRepository.findAll();

        List<ReportDTO> shopReports = new ArrayList<>();

        for(Report report : reports) {
            if(report.getReportedShop() != null && !report.isResolved()) {
                ReportDTO reportDTO = new ReportDTO(report);
                shopReports.add(reportDTO);
            }
        }

        return shopReports;
    }

    public List<ReportDTO> getUserReports() {

        List<Report> reports = reportRepository.findAll();

        List<ReportDTO> shopReports = new ArrayList<>();

        for(Report report : reports) {
            if(report.getReportedUser() != null && !report.isResolved()) {
                ReportDTO reportDTO = new ReportDTO(report);
                shopReports.add(reportDTO);
            }
        }

        return shopReports;
    }

    public List<ReportDTO> getProductReports() {

        List<Report> reports = reportRepository.findAll();

        List<ReportDTO> shopReports = new ArrayList<>();

        for(Report report : reports) {
            if(report.getReportedProductShop() != null && !report.isResolved()) {
                ReportDTO reportDTO = new ReportDTO(report);
                shopReports.add(reportDTO);
            }
        }

        return shopReports;
    }

    public List<ReportDTO> getReviewReports() {

        List<Report> reports = reportRepository.findAll();

        List<ReportDTO> shopReports = new ArrayList<>();

        for(Report report : reports) {
            if(report.getReportedReview() != null && !report.isResolved()) {
                ReportDTO reportDTO = new ReportDTO(report);
                shopReports.add(reportDTO);
            }
        }

        return shopReports;
    }
}
