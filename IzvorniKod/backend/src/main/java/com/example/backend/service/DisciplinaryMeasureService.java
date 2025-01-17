package com.example.backend.service;

import com.example.backend.exception.ReportNotFoundException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.DisciplinaryMeasure;
import com.example.backend.model.Person;
import com.example.backend.model.Report;
import com.example.backend.model.SendDcMeasureDTO;
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

    public String sendDcMeasure(SendDcMeasureDTO sendDcMeasureDTO, String token) {

        String email = jwtService.extractUsername(token);

        Person moderator = personRepository.findByEmail(email);

        if(moderator == null) {
            throw new UserNotFoundException("Moderator not found");
        }

        Person disciplinedUser = personRepository.findByEmail(sendDcMeasureDTO.getDisciplinedUserEmail());

        if(disciplinedUser == null) {
            throw new UserNotFoundException("User not found");
        }

        DisciplinaryMeasure disciplinaryMeasure = new DisciplinaryMeasure();
        disciplinaryMeasure.setType(sendDcMeasureDTO.getType());
        disciplinaryMeasure.setNote(sendDcMeasureDTO.getNote());
        disciplinaryMeasure.setDisciplinedPerson(disciplinedUser);
        disciplinaryMeasure.setIssuer(moderator);

        disciplinedUser.getDisciplinaryMeasures().add(disciplinaryMeasure);
        personRepository.save(disciplinedUser);

        Report report = reportRepository.findById(sendDcMeasureDTO.getReportId()).orElseThrow(() -> new ReportNotFoundException("Report not found"));

        report.setResolved(true);
        report.setDateResolved(LocalDateTime.now());
        reportRepository.save(report);

        //TODO add the disc measure effect e.g. 3 day ban, a week ban.....
        //TODO ukloniti reportove istih razloga..

        return "Disciplinary measure sent.";
    }
}
