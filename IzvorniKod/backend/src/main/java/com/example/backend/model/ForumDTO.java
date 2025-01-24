package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ForumDTO {
    private Long discussionId;
    private String title;
    private String text;
    private String authorName;
    private String authorEmail;
    private boolean isAuthor;
    private LocalDateTime dateTime;
}
