package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddShopDTO {

    private Long id; //if id != null, existing shop is being edited, not a new one being added
    private MultipartFile file;
    private String imagePath;
    private String shopName;
    private String description;
    private double latitude;
    private double longitude;
    private String hood;
}
