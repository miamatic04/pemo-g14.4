package com.example.backend.service;

import com.example.backend.dto.SendDcMeasureDTO;
import com.example.backend.enums.MeasureType;
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
public class DisciplinaryMeasureService {

    @Autowired
    private JWTService jwtService;

     @Autowired
     private PersonRepository personRepository;

     @Autowired
     private ReportRepository reportRepository;

     @Autowired
     private ModeratingActivityRepository moderatingActivityRepository;

    public String sendDcMeasure(SendDcMeasureDTO sendDcMeasureDTO, String token) {

        String email = jwtService.extractUsername(token);

        Person moderator = personRepository.findByEmail(email);

        if(moderator == null) {
            throw new UserNotFoundException("Moderator not found");
        }

        if(!moderator.getRole().contains("moderator") && !moderator.getRole().contains("admin"))
            throw new UnauthorizedActionException("Not a mod or admin");

        Report report = null;

        if(sendDcMeasureDTO.getReportId() != null)
            report = reportRepository.findById(sendDcMeasureDTO.getReportId()).orElseThrow(() -> new ReportNotFoundException("Report not found"));

        if(report.isResolved())
            throw new ReportNotFoundException("Report is already resolved");

        Person disciplinedUser = personRepository.findByEmail(sendDcMeasureDTO.getDisciplinedUserEmail());

        if(disciplinedUser == null) {
            throw new UserNotFoundException("User not found");
        }

        DisciplinaryMeasure disciplinaryMeasure = new DisciplinaryMeasure();
        disciplinaryMeasure.setType(MeasureType.valueOf(sendDcMeasureDTO.getType()));
        disciplinaryMeasure.setNote(sendDcMeasureDTO.getNote());
        disciplinaryMeasure.setDisciplinedPerson(disciplinedUser);
        disciplinaryMeasure.setIssuer(moderator);

        disciplinedUser.getDisciplinaryMeasures().add(disciplinaryMeasure);
        personRepository.save(disciplinedUser);

        if(report != null) {
            report.setResolved(true);
            report.setDateResolved(LocalDateTime.now());
            reportRepository.save(report);
        }

        ModeratingActivity moderatingActivity = new ModeratingActivity();
        moderatingActivity.setUser(disciplinedUser);
        moderatingActivity.setModerator(moderator);
        moderatingActivity.setDateTime(LocalDateTime.now());
        moderatingActivity.setReasons(sendDcMeasureDTO.getApprovedReasons());
        moderatingActivity.setWarning(false);
        moderatingActivity.setDisciplinaryMeasure(MeasureType.valueOf(sendDcMeasureDTO.getType()));
        moderatingActivity.setNote(sendDcMeasureDTO.getNote());

        moderatingActivity.setReport(report);

        moderatingActivityRepository.save(moderatingActivity);

        //TODO add the disc measure effect e.g. 3 day ban, a week ban.....

        return "Disciplinary measure sent.";
    }
}
