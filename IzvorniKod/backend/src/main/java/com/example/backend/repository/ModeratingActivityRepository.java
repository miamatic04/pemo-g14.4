package com.example.backend.repository;

import com.example.backend.model.ModeratingActivity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModeratingActivityRepository extends JpaRepository<ModeratingActivity, Long> {
}
