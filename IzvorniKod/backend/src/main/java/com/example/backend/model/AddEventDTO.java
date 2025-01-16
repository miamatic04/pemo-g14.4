package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddEventDTO {

    private String name;
    private String description;
    private LocalDateTime dateTime;
    private String frequency;
    private Integer duration;
    private String address;
    private MultipartFile file;
    private Long shopId;
}
