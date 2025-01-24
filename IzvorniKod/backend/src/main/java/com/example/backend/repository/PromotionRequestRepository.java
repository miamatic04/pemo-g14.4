package com.example.backend.repository;

import com.example.backend.model.PromotionRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionRequestRepository extends JpaRepository<PromotionRequest, Long> {
}
