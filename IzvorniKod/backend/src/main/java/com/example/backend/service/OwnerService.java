package com.example.backend.service;

import com.example.backend.exception.ShopDoesntBelongToGivenOwnerException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.Person;
import com.example.backend.model.Shop;
import com.example.backend.dto.ShopInfoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OwnerService {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private PersonService personService;

    @Autowired
    private ShopService shopService;

    public ResponseEntity<List<ShopInfoDTO>> getMyShops(String authHeader) {

        String email = jwtService.extractUsername(authHeader.substring(7));

        Person owner = personService.findUser(email);

        List<Shop> myShops;
        List<ShopInfoDTO> shopInfoDTOs = new ArrayList<>();

        if(owner != null) {
            myShops = owner.getShops();
            for(Shop shop : myShops) {
                shopInfoDTOs.add(new ShopInfoDTO(shop.getId(), shop.getShopName()));
            }
            return ResponseEntity.ok(shopInfoDTOs);
        } else {
            throw new UserNotFoundException("Owner not found.");
        }
    }

    public ResponseEntity<Void> deleteShop(int id, String authHeader) {

        String email = jwtService.extractUsername(authHeader.substring(7));

        Person owner = personService.findUser(email);

        int toBeRemoved = -1;

        boolean deleted = false;

        if(owner != null) {
            for(Shop s : owner.getShops()) {
                if(s.getId() == id) {
                    toBeRemoved = id;
                    System.out.println("to be removed id: " + toBeRemoved);
                }
            }

            System.out.println(toBeRemoved);
            if(toBeRemoved != -1) {
                shopService.removeShop((long) toBeRemoved);
                System.out.println((long) toBeRemoved);
            }

            if(toBeRemoved == -1) {
                throw new ShopDoesntBelongToGivenOwnerException("Shop doesn't belong to the given owner.");
            } else
                return ResponseEntity.ok().build();

        } else
            throw new UserNotFoundException("Owner not found.");

    }

}
