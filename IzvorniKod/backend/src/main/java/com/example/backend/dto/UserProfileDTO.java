package com.example.backend.dto;

import com.example.backend.enums.Hood;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDTO {

    private String firstName;
    private String lastName;
    private String email;
    private String dateOfBirth;
    private Hood hood;
}
