package com.example.backend.repository;

import com.example.backend.model.Moderator;
import com.example.backend.model.ShopOwner;
import com.example.backend.model.compositeKeyEmailOIB;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModeratorRepository  extends JpaRepository<Moderator, compositeKeyEmailOIB> {
}
