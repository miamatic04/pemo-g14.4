package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
public abstract class Person {

    private String firstName;
    private String lastName;
    //private Date dateOfBirth;
    @Id
    private String email;
    private String pass;

    private String role;

    private double longitude;
    private double latitude;
}

