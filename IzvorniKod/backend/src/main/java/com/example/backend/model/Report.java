package com.example.backend.model;

import com.example.backend.utils.ReportReasonConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = true)
    @JoinColumn(name = "shop_id", referencedColumnName = "id")
    private Shop reportedShop;

    @ManyToOne(optional = true)
    @JoinColumn(name = "reporter_email", referencedColumnName = "email")
    private Person reporter;

    @ManyToOne(optional = true)
    @JoinColumn(name = "reported_user_email", referencedColumnName = "email")
    private Person reportedUser;

    @ManyToOne(optional = true)
    @JoinColumn(name = "reported_review_id", referencedColumnName = "id")
    private Review reportedReview;

    @ManyToOne(optional = true)
    @JoinColumn(name = "product_shop_id")
    private ProductShop reportedProductShop;

    @Column(length = 1000)
    private String note;

    private boolean resolved;

    @Convert(converter = ReportReasonConverter.class)
    @Column(nullable = false)
    private List<ReportReason> reportReasons;

    private LocalDateTime dateReported;
    private LocalDateTime dateResolved;
}
