package com.example.backend.controller;

import com.example.backend.model.ModeratingActivityDTO;
import com.example.backend.model.UserActivityDTO;
import com.example.backend.service.LogService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class LogController {

    @Autowired
    private LogService logService;

    @PostMapping("/logModActivity")
    public ResponseEntity<String> logModeratorActivity(@RequestBody ModeratingActivityDTO moderatingActivityDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(logService.logModeratorActivity(moderatingActivityDTO, authHeader.substring(7)));
    }

    @GetMapping("/getModLogs")
    public ResponseEntity<List<ModeratingActivityDTO>> getModeratorLogs() {
        return ResponseEntity.ok(logService.getModeratorLogs());
    }

    @GetMapping("/getUserLogs")
    public ResponseEntity<List<UserActivityDTO>> getUserLogs() {
        return ResponseEntity.ok(logService.getUserActivity());
    }
}
