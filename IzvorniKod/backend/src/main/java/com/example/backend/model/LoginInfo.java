package com.example.backend.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginInfo {
    private String email;
    private String pass;

}