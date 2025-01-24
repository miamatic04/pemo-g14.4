package com.example.backend.dto;

import com.example.backend.dto.EventDTO;
import com.example.backend.dto.ShopProfileDTO;
import com.example.backend.model.Shop;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ShopDistance {
    private ShopProfileDTO shopDTO;
    private double distance;

    public ShopDistance(Shop shop, double distance) {
        this.shopDTO = new ShopProfileDTO(shop, false);

        for(EventDTO eventDTO : this.shopDTO.getEvents()) {
            eventDTO.setDistance(distance);
        }

        this.distance = distance;
    }
}
