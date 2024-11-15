package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@Entity
public class Person {

    //zajednicki:
    @Id
    private String email;
    private String firstName;
    private String lastName;
    private String pass;
    private String role;
    private double longitude;
    private double latitude;

    //shopOwner:
    private String OIB;
    @OneToMany(mappedBy = "shopOwner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Shop> shops;

    @Transient
    private String passConfirm; // registration DTO treba napravit...

    public Person(RegistrationInfo registrationInfo) {
        this.email = registrationInfo.getEmail();
        this.firstName = registrationInfo.getFirstName();
        this.lastName = registrationInfo.getLastName();
        this.pass = registrationInfo.getPass();
        this.role = registrationInfo.getRole();
    }
}

