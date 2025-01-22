package com.example.backend.service;

import com.example.backend.exception.ReportNotFoundException;
import com.example.backend.exception.UnauthorizedActionException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.ModeratingActivityRepository;
import com.example.backend.repository.PersonRepository;
import com.example.backend.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class WarningService {

    @Autowired
    private JWTService jwtService;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ModeratingActivityRepository moderatingActivityRepository;

    public String sendWarning(SendWarningDTO sendWarningDTO, String token) {

        String email = jwtService.extractUsername(token);

        Person moderator = personRepository.findByEmail(email);

        if(moderator == null) {
            throw new UserNotFoundException("Moderator not found");
        }

        if(!moderator.getRole().contains("moderator") && !moderator.getRole().contains("admin"))
            throw new UnauthorizedActionException("Not a mod or admin");

        Report report = null;

        if(sendWarningDTO.getReportId() != null)
            report = reportRepository.findById(sendWarningDTO.getReportId()).orElseThrow(() -> new ReportNotFoundException("Report not found"));

        if(report.isResolved())
            throw new ReportNotFoundException("Report is already resolved");

        Person warnedUser = personRepository.findByEmail(sendWarningDTO.getWarnedUserEmail());

        if(warnedUser == null) {
            throw new UserNotFoundException("User not found");
        }

        Warning warning = new Warning();
        warning.setWarnedPerson(warnedUser);
        warning.setNote(sendWarningDTO.getNote());
        warning.setModerator(moderator);

        warnedUser.getWarnings().add(warning);
        personRepository.save(warnedUser);

        if(report != null) {
            report.setResolved(true);
            report.setDateResolved(LocalDateTime.now());
            reportRepository.save(report);
        }

        ModeratingActivity moderatingActivity = new ModeratingActivity();
        moderatingActivity.setUser(warnedUser);
        moderatingActivity.setModerator(moderator);
        moderatingActivity.setDateTime(LocalDateTime.now());
        moderatingActivity.setReasons(sendWarningDTO.getApprovedReasons());
        moderatingActivity.setWarning(true);
        moderatingActivity.setNote(sendWarningDTO.getNote());

        moderatingActivity.setReport(report);

        moderatingActivityRepository.save(moderatingActivity);


        //TODO ukloniti reportove istih razloga..

        return "User warning sent.";
    }


}
