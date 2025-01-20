package com.example.backend.model;

import com.example.backend.service.TokenGenerator;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Person {

    @Id
    private String email;
    private String firstName;
    private String lastName;
    private String pass;
    private String role;
    private double longitude;
    private double latitude;
    private String confirmationToken;
    private Boolean emailConfirmed;
    private String username;
    private String imagePath;

    private String OIB;
    @OneToMany(mappedBy = "shopOwner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Shop> shops;

    @Transient
    private String passConfirm;

    private String googleAccessToken;

    public Person(RegistrationInfo registrationInfo) {
        this.email = registrationInfo.getEmail();
        this.firstName = registrationInfo.getFirstName();
        this.lastName = registrationInfo.getLastName();
        this.pass = registrationInfo.getPass();
        this.role = registrationInfo.getRole();
        this.confirmationToken = TokenGenerator.generateToken();
        this.emailConfirmed = false;
    }

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "reporter", cascade = CascadeType.ALL)
    private List<Report> sentReports = new ArrayList<>();

    @OneToMany(mappedBy = "reportedUser", cascade = CascadeType.ALL)
    private List<Report> incomingReports = new ArrayList<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    private List<Reply> replies = new ArrayList<>();

    @OneToMany(mappedBy = "warnedPerson", cascade = CascadeType.ALL)
    private List<Warning> warnings = new ArrayList<>();

    @OneToMany(mappedBy = "disciplinedPerson", cascade = CascadeType.ALL)
    private List<DisciplinaryMeasure> disciplinaryMeasures = new ArrayList<>();

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CustomerOrder> customerOrders;

    public String getName() {
        return firstName + " " + lastName;
    }

    @Enumerated(EnumType.STRING)
    private Hood hood;
}

