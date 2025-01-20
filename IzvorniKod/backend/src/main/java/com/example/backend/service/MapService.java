package com.example.backend.service;

import com.example.backend.model.MapMarkerDTO;
import com.example.backend.model.Shop;
import com.example.backend.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MapService {

    @Autowired
    private ShopRepository shopRepository;

    public List<MapMarkerDTO> getMarkerInfo() {

        List<Shop> shops = shopRepository.findAll();

        return shops
                .stream()
                .map((shop) -> {
                    MapMarkerDTO marker = new MapMarkerDTO();
                    marker.setLatitude(shop.getLatitude());
                    marker.setLongitude(shop.getLongitude());
                    marker.setName(shop.getShopName());
                    return marker;
                })
                .toList();
    }
}
