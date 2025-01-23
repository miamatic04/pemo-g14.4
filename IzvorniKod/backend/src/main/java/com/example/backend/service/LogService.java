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
    @Autowired
    private UserActivityRepository userActivityRepository;


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
                    if(log.getReport() != null)
                        moderatingActivityDTO.setReportId(log.getReport().getId());
                    moderatingActivityDTO.setDateTime(log.getDateTime());
                    moderatingActivityDTO.setWarning(log.isWarning());
                    moderatingActivityDTO.setDisciplinaryMeasure(log.getDisciplinaryMeasure());
                    moderatingActivityDTO.setUserEmail(log.getUser().getEmail());
                    moderatingActivityDTO.setUserName(log.getUser().getName());
                    moderatingActivityDTO.setApprovedReasons(log.getReasons());
                    moderatingActivityDTO.setNote(log.getNote());
                    moderatingActivityDTO.setIgnored(log.isIgnored());
                    return moderatingActivityDTO;
                })
                .toList();

        return moderatingActivityDTOs;
    }

    public List<ModeratingActivityDTO> getModeratorShopLogs() {

        List<ModeratingActivity> moderatingActivities = moderatingActivityRepository.findAll();

        List<ModeratingActivityDTO> moderatingActivityDTOs = new ArrayList<>();

        moderatingActivityDTOs = moderatingActivities
                .stream()
                .filter((log) -> log.getReport().getReportedShop() != null)
                .map((log) -> {
                    ModeratingActivityDTO moderatingActivityDTO = new ModeratingActivityDTO();
                    moderatingActivityDTO.setModeratorEmail(log.getModerator().getEmail());
                    moderatingActivityDTO.setModeratorName(log.getModerator().getName());
                    if(log.getReport() != null)
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

    public List<ModeratingActivityDTO> getModeratorProductLogs() {

        List<ModeratingActivity> moderatingActivities = moderatingActivityRepository.findAll();

        List<ModeratingActivityDTO> moderatingActivityDTOs = new ArrayList<>();

        moderatingActivityDTOs = moderatingActivities
                .stream()
                .filter((log) -> log.getReport().getReportedProductShop() != null)
                .map((log) -> {
                    ModeratingActivityDTO moderatingActivityDTO = new ModeratingActivityDTO();
                    moderatingActivityDTO.setModeratorEmail(log.getModerator().getEmail());
                    moderatingActivityDTO.setModeratorName(log.getModerator().getName());
                    if(log.getReport() != null)
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

    public List<ModeratingActivityDTO> getModeratorUserLogs() {

        List<ModeratingActivity> moderatingActivities = moderatingActivityRepository.findAll();

        List<ModeratingActivityDTO> moderatingActivityDTOs = new ArrayList<>();

        moderatingActivityDTOs = moderatingActivities
                .stream()
                .filter((log) -> log.getReport().getReportedUser() != null
                        && log.getReport().getReportedShop() == null
                        && log.getReport().getReportedProductShop() != null
                        && log.getReport().getReportedReview() == null)
                .map((log) -> {
                    ModeratingActivityDTO moderatingActivityDTO = new ModeratingActivityDTO();
                    moderatingActivityDTO.setModeratorEmail(log.getModerator().getEmail());
                    moderatingActivityDTO.setModeratorName(log.getModerator().getName());
                    if(log.getReport() != null)
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

    public List<ModeratingActivityDTO> getModeratorReviewLogs() {

        List<ModeratingActivity> moderatingActivities = moderatingActivityRepository.findAll();

        List<ModeratingActivityDTO> moderatingActivityDTOs = new ArrayList<>();

        moderatingActivityDTOs = moderatingActivities
                .stream()
                .filter((log) -> log.getReport().getReportedReview() != null)
                .map((log) -> {
                    ModeratingActivityDTO moderatingActivityDTO = new ModeratingActivityDTO();
                    moderatingActivityDTO.setModeratorEmail(log.getModerator().getEmail());
                    moderatingActivityDTO.setModeratorName(log.getModerator().getName());
                    if(log.getReport() != null)
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

    public List<UserActivityDTO> getUserActivity() {

        List<UserActivity> userActivities = userActivityRepository.findAll();

        List<UserActivityDTO> userActivityDTOs = new ArrayList<>();

        userActivityDTOs = userActivities
                .stream()
                .map((activity) -> {
                    UserActivityDTO userActivityDTO = new UserActivityDTO();
                    userActivityDTO.setUserEmail(activity.getUser().getEmail());
                    userActivityDTO.setUserName(activity.getUser().getName());
                    userActivityDTO.setDateTime(activity.getDateTime());
                    userActivityDTO.setNote(activity.getNote());
                    userActivityDTO.setActivityType(activity.getActivityType());
                    return userActivityDTO;
                })
                .toList();

        return userActivityDTOs;
    }
}
