package com.example.backend.controller;

import com.example.backend.model.ChangeRoleDTO;
import com.example.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.annotation.RequestScope;

@RestController
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/assignRole")
    public ResponseEntity<String> assignRole(@RequestBody ChangeRoleDTO changeRoleDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(adminService.changeRole(changeRoleDTO, authHeader.substring(7)));
    }
}
