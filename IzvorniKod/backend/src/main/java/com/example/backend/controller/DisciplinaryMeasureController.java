package com.example.backend.controller;

import com.example.backend.dto.SendDcMeasureDTO;
import com.example.backend.service.DisciplinaryMeasureService;
import com.example.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DisciplinaryMeasureController {

    @Autowired
    private DisciplinaryMeasureService disciplinaryMeasureService;
    @Autowired
    private ReportService reportService;

    @PostMapping("/sendDcMeasure")
    public ResponseEntity<String> sendDcMeasure(@RequestBody SendDcMeasureDTO sendDcMeasureDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(disciplinaryMeasureService.sendDcMeasure(sendDcMeasureDTO, authHeader.substring(7)));
    }

}
