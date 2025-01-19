package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SendDcMeasureDTO {
    private Long reportId;
    private String disciplinedUserEmail;
    private String note;
    private String type;
}
