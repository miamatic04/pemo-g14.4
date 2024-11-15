package com.example.backend.repository;

import com.example.backend.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonRepository extends JpaRepository<Person, String> {

    Person save(Person person);
    Person findByEmail(String email);
    Person findByConfirmationToken(String confirmationToken);
}
