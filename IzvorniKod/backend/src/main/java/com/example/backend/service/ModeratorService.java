package com.example.backend.service;

import com.example.backend.model.Moderator;
import com.example.backend.repository.ModeratorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ModeratorService {

    @Autowired
    private ModeratorRepository moderatorRepository;

    public Moderator findModerator(String email) {
        return moderatorRepository.findByEmail(email);
    }
}
