package com.example.backend.repository;

import com.example.backend.model.ShopUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<ShopUser, String> {

    ShopUser findByEmail(String email);
}
