package com.example.backend.model;

import jakarta.persistence.*;

import java.util.Date;

@MappedSuperclass
public abstract class Person {


    private String firstName;
    private String lastName;
    private Date dateOfBirth;
    @Id
    private String email;
    private String pass;

    public String getFirstName() {
        return firstName;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }

    public String getfirstName() { return firstName; }
    public void setFirstName(String ime) { this.firstName = ime; }

    public String getLastName() { return lastName; }
    public void setLastName(String prezime) { this.lastName = prezime; }
}
