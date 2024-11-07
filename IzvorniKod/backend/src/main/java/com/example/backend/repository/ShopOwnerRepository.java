package com.example.backend.repository;

import com.example.backend.model.compositeKeyEmailOIB;
import com.example.backend.model.ShopOwner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopOwnerRepository extends JpaRepository<ShopOwner, compositeKeyEmailOIB> {
}
