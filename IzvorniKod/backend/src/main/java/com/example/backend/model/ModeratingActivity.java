package com.example.backend.model;

import com.example.backend.utils.ReportReasonConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModeratingActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "moderator_id", nullable = false)
    private Person moderator;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Person user;

    @ManyToOne(optional = true)
    @JoinColumn(name = "report_id")
    private Report report;

    private LocalDateTime dateTime;
    private boolean warning;

    @Enumerated(EnumType.STRING)
    private MeasureType disciplinaryMeasure;

    @Convert(converter = ReportReasonConverter.class)
    @Column(nullable = false)
    private List<ReportReason> reasons;

    private String note;
}