package com.example.backend.utils;

import com.example.backend.dto.ProductInfoDTO;
import com.example.backend.dto.ShopDistance;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.PersonRepository;
import com.example.backend.repository.ProductShopRepository;
import com.example.backend.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

@Service
public class Recommend {

    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductShopRepository productShopRepository;
    @Autowired
    private ShopRepository shopRepository;
    @Autowired
    private DistanceCalculator distanceCalculator;

    public List<ProductInfoDTO> recommendProducts(String email) {

        List<ProductInfoDTO> recommendedDTO = new ArrayList<>();

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        List<String> recentCategories = findCategories(email);

        List<ProductShop> recommended = productShopRepository.findProductShopsByCategories(recentCategories);

        recommendedDTO = recommended
                .stream()
                .map((product) -> new ProductInfoDTO(product))
                .toList();

        return recommendedDTO;

    }

    public List<ShopDistance> recommendShops(String email) {

        List<ProductInfoDTO> recommended = new ArrayList<>();

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        List<String> recentCategories = findCategories(email);

        double userLatitude = user.getLatitude();
        double userLongitude = user.getLongitude();

        boolean location = true;

        if(userLatitude == 0 || userLongitude == 0)
            location = false;

        List<Shop> shops = shopRepository.findShopsByProductCategories(recentCategories);

        DecimalFormat df = new DecimalFormat("#.#");

        List<ShopDistance> shopsWithDistance = new ArrayList<>();

        for(Shop shop : shops) {
            double distance = distanceCalculator.calculateDistance(userLatitude, userLongitude, shop.getLatitude(), shop.getLongitude());
            String formattedDistance = df.format(distance).replace(",", ".");
            double roundedDistance = Double.parseDouble(formattedDistance);
            if(!location)
                roundedDistance = -1;
            shopsWithDistance.add(new ShopDistance(shop, roundedDistance));
        }

        return shopsWithDistance;

    }

    private List<String> findCategories(String email) {

        List<CustomerOrder> recentOrders = orderRepository.findTop3ByPersonEmailAndPaidTrueOrderByOrderDateDesc(email);

        List<String> recentCategories = new ArrayList<>();

        for(CustomerOrder order : recentOrders) {
            for(OrderProduct orderProduct : order.getOrderProducts()) {
                recentCategories.add(orderProduct.getProductShop().getProduct().getCategory());
            }
        }

        return recentCategories;
    }
}
