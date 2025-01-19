package com.example.backend.service;

import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class LogService {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private ModeratingActivityRepository moderatingActivityRepository;

    @Autowired
    private ReportRepository reportRepository;


    public String logModeratorActivity(ModeratingActivityDTO moderatingActivityDTO, String token) {

        String moderatorEmail = jwtService.extractUsername(token);

        Person moderator = personRepository.findByEmail(moderatorEmail);

        if(moderator == null) {
            throw new UserNotFoundException("Moderator not found");
        }

        Person user = personRepository.findByEmail(moderatingActivityDTO.getUserEmail());

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        ModeratingActivity moderatingActivity = new ModeratingActivity();
        moderatingActivity.setUser(user);
        moderatingActivity.setModerator(moderator);
        moderatingActivity.setDateTime(LocalDateTime.now());
        moderatingActivity.setReasons(moderatingActivityDTO.getApprovedReasons());
        moderatingActivity.setWarning(moderatingActivityDTO.isWarning());
        moderatingActivity.setDisciplinaryMeasure(moderatingActivityDTO.getDisciplinaryMeasure());
        moderatingActivity.setNote(moderatingActivityDTO.getNote());

        Report report = reportRepository.findById(moderatingActivityDTO.getReportId()).orElse(null);

        moderatingActivity.setReport(report);

        moderatingActivityRepository.save(moderatingActivity);

        return "Moderator activity successfully logged";
    }

    public List<ModeratingActivityDTO> getModeratorLogs() {

        List<ModeratingActivity> moderatingActivities = moderatingActivityRepository.findAll();

        List<ModeratingActivityDTO> moderatingActivityDTOs = new ArrayList<>();

        moderatingActivityDTOs = moderatingActivities
                .stream()
                .map((log) -> {
                    ModeratingActivityDTO moderatingActivityDTO = new ModeratingActivityDTO();
                    moderatingActivityDTO.setModeratorEmail(log.getModerator().getEmail());
                    moderatingActivityDTO.setModeratorName(log.getModerator().getName());
                    moderatingActivityDTO.setReportId(log.getReport().getId());
                    moderatingActivityDTO.setDateTime(log.getDateTime());
                    moderatingActivityDTO.setWarning(log.isWarning());
                    moderatingActivityDTO.setDisciplinaryMeasure(log.getDisciplinaryMeasure());
                    moderatingActivityDTO.setUserEmail(log.getUser().getEmail());
                    moderatingActivityDTO.setUserName(log.getUser().getName());
                    moderatingActivityDTO.setApprovedReasons(log.getReasons());
                    moderatingActivityDTO.setNote(log.getNote());
                    return moderatingActivityDTO;
                })
                .toList();

        return moderatingActivityDTOs;
    }
}
