package com.example.backend.dto;

import com.example.backend.enums.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserActivityDTO {

    private String userEmail;
    private String userName;
    private ActivityType activityType;
    private String note;
    private LocalDateTime dateTime;
}
