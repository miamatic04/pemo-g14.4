package com.example.backend.service;

import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.ChangeRoleDTO;
import com.example.backend.model.Person;
import com.example.backend.model.ChangeRole;
import com.example.backend.repository.ChangeRoleRepository;
import com.example.backend.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private JWTService jwtService;
    @Autowired
    private ChangeRoleRepository changeRoleRepository;

    public String changeRole(ChangeRoleDTO changeRoleDTO, String token) {

        String adminEmail = jwtService.extractUsername(token);

        Person admin = personRepository.findByEmail(adminEmail);

        if(admin == null) {
            throw new UserNotFoundException("Admin not found");
        }

        Person user = personRepository.findByEmail(changeRoleDTO.getEmail());

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        ChangeRole changeRole = new ChangeRole();
        changeRole.setOldRole(user.getRole());

        user.setRole(changeRoleDTO.getRole().toString());
        personRepository.save(user);

        changeRole.setNewRole(changeRoleDTO.getRole());
        changeRole.setUser(user);
        changeRole.setAdmin(admin);
        changeRole.setNote(changeRoleDTO.getNote());
        changeRoleRepository.save(changeRole);

        return "Role changed successfully";
    }
}
