package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MapMarkerDTO {
    private double latitude;
    private double longitude;
    private String name;
    private String imagePath;
    private String description;
}
