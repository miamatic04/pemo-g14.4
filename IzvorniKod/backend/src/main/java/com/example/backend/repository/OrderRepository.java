package com.example.backend.repository;

import com.example.backend.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {
    Optional<CustomerOrder> findByPersonEmailAndActive(String email, boolean active);
    List<CustomerOrder> findTop3ByPersonEmailAndPaidTrueOrderByOrderDateDesc(String email);
}
