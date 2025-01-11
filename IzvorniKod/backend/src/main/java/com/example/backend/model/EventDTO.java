package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDTO {

    private String name;
    private String description;
    private String address;
    private LocalDateTime dateTime;
    private Integer duration;
    private String imagePath;
    private Long shopId;
    private String shopName;
    private double distance;
}
