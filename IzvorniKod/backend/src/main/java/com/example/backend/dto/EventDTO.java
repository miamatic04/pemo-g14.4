package com.example.backend.dto;

import com.example.backend.model.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDTO {
    private Long id;
    private String name;
    private String description;
    private String address;
    private LocalDateTime dateTime;
    private Integer duration;
    private String imagePath;
    private Long shopId;
    private String shopName;
    private double distance;

    public EventDTO(Event event, double distance) {
        this.name = event.getName();
        this.description = event.getDescription();
        this.address = event.getAddress();
        this.dateTime = event.getDateTime();
        this.duration = event.getDuration();
        this.imagePath = event.getImagePath();
        this.shopId = event.getShop().getId();
        this.shopName = event.getShop().getShopName();
        this.distance = distance;
    }
}
