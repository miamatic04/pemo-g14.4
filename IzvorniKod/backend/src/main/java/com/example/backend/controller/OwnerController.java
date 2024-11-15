package com.example.backend.controller;

import com.example.backend.exception.ShopDoesntBelongToGivenOwnerException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.Person;
import com.example.backend.model.Shop;
import com.example.backend.service.JWTService;
import com.example.backend.service.PersonService;
import com.example.backend.service.ShopService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class OwnerController {

    @Autowired
    private PersonService personService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private ShopService shopService;

    @GetMapping("/owner/getMyShops")
    public ResponseEntity<List<Shop>> getMyShops(@RequestHeader(value = "Authorization", required = false) String authHeader) {

        String email = jwtService.extractUsername(authHeader.substring(7));

        Person owner = personService.findUser(email);

        List<Shop> myShops;

        if(owner != null) {
            myShops = owner.getShops();
            return ResponseEntity.ok(myShops);
        } else {
            throw new UserNotFoundException("Owner not found.");
        }
    }

    @DeleteMapping("/owner/deleteShop")
    @Transactional
    public ResponseEntity<Void> deleteShop(@RequestParam("id") int id, @RequestHeader(value = "Authorization", required = false) String authHeader) {

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
