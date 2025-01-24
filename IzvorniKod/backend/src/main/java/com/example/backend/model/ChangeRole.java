package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangeRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String oldRole;

    private String newRole;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Person user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "admin_id", nullable = false)
    private Person admin;

    private String note;
}
