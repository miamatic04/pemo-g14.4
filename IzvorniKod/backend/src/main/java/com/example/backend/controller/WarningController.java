package com.example.backend.controller;

import com.example.backend.model.SendWarningDTO;
import com.example.backend.service.WarningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WarningController {

    @Autowired
    private WarningService warningService;

    @PostMapping("/sendWarning")
    public ResponseEntity<String> sendWarning(@RequestBody SendWarningDTO sendWarningDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(warningService.sendWarning(sendWarningDTO, authHeader.substring(7)));
    }
}
