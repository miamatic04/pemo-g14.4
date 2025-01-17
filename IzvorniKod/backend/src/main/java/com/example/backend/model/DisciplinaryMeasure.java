package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class DisciplinaryMeasure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "disciplined_person_email", referencedColumnName = "email")
    private Person disciplinedPerson;

    @ManyToOne(optional = false)
    @JoinColumn(name = "issuer_email", referencedColumnName = "email")
    private Person issuer;

    @Column(length = 1000)
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MeasureType type;
}