package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Warning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "warned_person_email", referencedColumnName = "email")
    private Person warnedPerson;

    @ManyToOne(optional = false)
    @JoinColumn(name = "moderator_email", referencedColumnName = "email")
    private Person moderator;

    @Column(length = 1000)
    private String note;

    private boolean userNotified;
}
