package com.example.backend.dto;

import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatformProductDTO {
    private Long id;
    private String name;
    private String category;
    private int ageRestriction; //empty (0) if none
    private String imagePath;
}
