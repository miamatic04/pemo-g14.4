package com.example.backend.repository;

import com.example.backend.model.Event;
import com.example.backend.model.EventSignUp;
import com.example.backend.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventSignUpRepository extends JpaRepository<EventSignUp, Long> {
    boolean existsByPersonAndEvent(Person person, Event event);
}
