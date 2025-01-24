package com.example.backend.controller;

import com.example.backend.dto.MapMarkerDTO;
import com.example.backend.service.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MapController {

    @Autowired
    private MapService mapService;

    @GetMapping("/getMarkerInfo")
    public ResponseEntity<List<MapMarkerDTO>> getMarkerInfo() {
        return ResponseEntity.ok(mapService.getMarkerInfo());
    }
}
