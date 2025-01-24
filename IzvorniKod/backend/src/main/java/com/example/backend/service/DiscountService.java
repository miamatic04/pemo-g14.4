package com.example.backend.service;

import com.example.backend.dto.DiscountDTO;
import com.example.backend.exception.ShopDoesntBelongToGivenOwnerException;
import com.example.backend.exception.ShopNotFoundException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.repository.DiscountRepository;
import com.example.backend.repository.PersonRepository;
import com.example.backend.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.model.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DiscountService {

    @Autowired
    private JWTService jwtService;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private ShopRepository shopRepository;
    @Autowired
    private DiscountRepository discountRepository;

    @Autowired
    private ShopService shopService;

    public String addDiscount(DiscountDTO discountDTO, String token) {

        String email = jwtService.extractUsername(token);

        Person owner = personRepository.findByEmail(email);

        if(owner == null) {
            throw new UserNotFoundException("Owner not found");
        }

        Shop shop = shopRepository.findById(discountDTO.getShopId()).orElseThrow(() -> new ShopNotFoundException("Shop not found"));

        if(!shop.getShopOwner().getEmail().equals(email)) {
            throw new ShopDoesntBelongToGivenOwnerException("Shop doesnt belong to given owner");
        }

        Discount discount = new Discount();
        discount.setDiscount(discountDTO.getDiscount());
        discount.setShop(shop);
        discount.setCode(discountDTO.getCode());
        discountRepository.save(discount);

        return "Discount added successfully";
    }

    public Map<String, Object> applyDiscount(DiscountDTO discountDTO) {

        List<Discount> discounts = discountRepository.findAll();

        Map<String, Object> response = new HashMap<>();

        for(Discount discount : discounts) {
            if(discount.getCode().equals(discountDTO.getCode())) {
                response.put("discount", discount.getDiscount());
                response.put("shopId", discount.getShop().getId());
            }
        }

        return response;
    }

    public List<DiscountDTO> getDiscounts(Long shopId) {
        List<Discount> discounts = discountRepository.findAll();
        List<DiscountDTO> discountDTOs = new ArrayList<>();

        discountDTOs = discounts
                .stream()
                .filter((discount) -> discount.getShop().getId().equals(shopId))
                .map((discount) -> {
                    DiscountDTO discountDTO = new DiscountDTO();
                    discountDTO.setDiscount(discount.getDiscount());
                    discountDTO.setCode(discount.getCode());
                    discountDTO.setShopId(discount.getShop().getId());
                    return discountDTO;
                })
                .toList();

        return discountDTOs;
    }

    public List<DiscountDTO> getAllDiscounts() {
        List<Discount> discounts = discountRepository.findAll();
        List<DiscountDTO> discountDTOs = new ArrayList<>();

        discountDTOs = discounts
                .stream()
                .map((discount) -> {
                    DiscountDTO discountDTO = new DiscountDTO();
                    discountDTO.setDiscount(discount.getDiscount());
                    discountDTO.setCode(discount.getCode());
                    discountDTO.setShopId(discount.getShop().getId());
                    return discountDTO;
                })
                .toList();

        return discountDTOs;
    }

    public List<DiscountDTO> getHoodDiscounts(String token) {

        List<Discount> discounts = discountRepository.findAll();

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        List<DiscountDTO> discountDTOs = new ArrayList<>();

        discountDTOs = discounts
                .stream()
                .filter((discount) -> discount.getShop().getHood().equals(user.getHood()))
                .map((discount) -> {
                    DiscountDTO discountDTO = new DiscountDTO();
                    discountDTO.setShopName(discount.getShop().getShopName());
                    discountDTO.setDiscount(discount.getDiscount());
                    discountDTO.setCode(discount.getCode());
                    discountDTO.setShopId(discount.getShop().getId());
                    return discountDTO;
                })
                .toList();

        return discountDTOs;
    }
}
