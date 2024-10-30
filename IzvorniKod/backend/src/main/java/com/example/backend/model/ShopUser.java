package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;

@Entity
public class ShopUser {

    @Id
    private String email;
    private String firstName;
    private String lastName;
    private String pass;
    @Transient
    private String passConfirm;

    public ShopUser() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String password) {
        this.pass = password;
    }

    public String getPassConfirm() {
        return passConfirm;
    }

    public void setPassConfirm(String passConfirm) {
        this.passConfirm = passConfirm;
    }
}
