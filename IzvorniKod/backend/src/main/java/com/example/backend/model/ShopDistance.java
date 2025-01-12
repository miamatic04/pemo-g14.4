package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ShopDistance {
    private ShopProfileDTO shopDTO;
    private double distance;

    public ShopDistance(Shop shop, double distance) {
        this.shopDTO = new ShopProfileDTO(shop);

        for(EventDTO eventDTO : this.shopDTO.getEvents()) {
            eventDTO.setDistance(distance);
        }

        this.distance = distance;
    }
}
