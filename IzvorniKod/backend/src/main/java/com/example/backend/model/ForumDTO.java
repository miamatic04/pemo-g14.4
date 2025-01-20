package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ForumDTO {

    private String title;
    private String text;
    private String authorName;
    private String authorEmail;
    private boolean isAuthor;
}
