package com.example.backend.dto;

import com.example.backend.dto.EventDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDistance {

    private EventDTO event;
    private double distance;
}
