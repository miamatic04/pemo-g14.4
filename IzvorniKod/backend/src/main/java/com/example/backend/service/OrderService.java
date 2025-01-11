package com.example.backend.service;

import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PersonRepository personRepository;


    @Autowired
    private JWTService jwtService;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private OrderProductRepository orderProductRepository;

    @Autowired
    private ProductShopRepository productShopRepository;

    public List<OrderDTO> getAllOrders(String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        List<OrderDTO> orders = user.getCustomerOrders()
                .stream()
                .map(order -> {
                    OrderDTO orderDTO = new OrderDTO();
                    orderDTO.setId(order.getId());
                    orderDTO.setShopId(order.getShop().getId());
                    orderDTO.setShopName(order.getShop().getShopName());
                    orderDTO.setImagePath(order.getShop().getImagePath());

                    Map<ProductInfoDTO, Integer> product_quantity = new HashMap<>();
                    double total = 0;

                    for(OrderProduct orderProduct : order.getOrderProducts()) {
                        product_quantity.put(new ProductInfoDTO(orderProduct.getProductShop()), orderProduct.getQuantity());
                        total += orderProduct.getQuantity() * orderProduct.getProductShop().getPrice();
                    }

                    orderDTO.setOrderProducts(product_quantity);
                    orderDTO.setTotal(total);
                    orderDTO.setPaid(order.isPaid());
                    orderDTO.setCancelled(order.isCancelled());
                    orderDTO.setOrderDate(order.getOrderDate());
                    return orderDTO;
                }).toList();

        return orders;
    }

    public List<OrderDTO> getPendingOrders(String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        List<Long> ordersProcessed = new ArrayList<>();

        List<OrderDTO> orders = user.getCustomerOrders()
                .stream()
                .filter(order ->  !order.isPaid() && !order.isCancelled())
                .map(order -> {
                    OrderDTO orderDTO = new OrderDTO();
                    orderDTO.setId(order.getId());
                    orderDTO.setShopId(order.getShop().getId());
                    orderDTO.setShopName(order.getShop().getShopName());
                    orderDTO.setImagePath(order.getShop().getImagePath());

                    Map<ProductInfoDTO, Integer> product_quantity = new HashMap<>();
                    double total = 0;

                    for(OrderProduct orderProduct : order.getOrderProducts()) {
                        product_quantity.put(new ProductInfoDTO(orderProduct.getProductShop()), orderProduct.getQuantity());
                        total += orderProduct.getQuantity() * orderProduct.getProductShop().getPrice();
                    }

                    orderDTO.setOrderProducts(product_quantity);
                    orderDTO.setTotal(total);
                    orderDTO.setPaid(order.isPaid());
                    orderDTO.setCancelled(order.isCancelled());
                    orderDTO.setOrderDate(order.getOrderDate());
                    return orderDTO;
                }).toList();

        return orders;
    }

    public List<OrderDTO> getPaidOrders(String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        List<Long> ordersProcessed = new ArrayList<>();

        List<OrderDTO> orders = user.getCustomerOrders()
                .stream()
                .filter(order -> order.isPaid())
                .map(order -> {
                    OrderDTO orderDTO = new OrderDTO();
                    orderDTO.setId(order.getId());
                    orderDTO.setShopId(order.getShop().getId());
                    orderDTO.setShopName(order.getShop().getShopName());
                    orderDTO.setImagePath(order.getShop().getImagePath());

                    Map<ProductInfoDTO, Integer> product_quantity = new HashMap<>();
                    double total = 0;

                    for(OrderProduct orderProduct : order.getOrderProducts()) {
                        product_quantity.put(new ProductInfoDTO(orderProduct.getProductShop()), orderProduct.getQuantity());
                        total += orderProduct.getQuantity() * orderProduct.getProductShop().getPrice();
                    }

                    orderDTO.setOrderProducts(product_quantity);
                    orderDTO.setTotal(total);
                    orderDTO.setPaid(order.isPaid());
                    orderDTO.setCancelled(order.isCancelled());
                    orderDTO.setOrderDate(order.getOrderDate());
                    return orderDTO;
                }).toList();

        return orders;
    }

    public List<OrderDTO> getCancelledOrders(String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        List<Long> ordersProcessed = new ArrayList<>();

        List<OrderDTO> orders = user.getCustomerOrders()
                .stream()
                .filter(order -> order.isCancelled())
                .map(order -> {
                    OrderDTO orderDTO = new OrderDTO();
                    orderDTO.setId(order.getId());
                    orderDTO.setShopId(order.getShop().getId());
                    orderDTO.setShopName(order.getShop().getShopName());
                    orderDTO.setImagePath(order.getShop().getImagePath());

                    Map<ProductInfoDTO, Integer> product_quantity = new HashMap<>();
                    double total = 0;

                    for(OrderProduct orderProduct : order.getOrderProducts()) {
                        product_quantity.put(new ProductInfoDTO(orderProduct.getProductShop()), orderProduct.getQuantity());
                        total += orderProduct.getQuantity() * orderProduct.getProductShop().getPrice();
                    }

                    orderDTO.setOrderProducts(product_quantity);
                    orderDTO.setTotal(total);
                    orderDTO.setPaid(order.isPaid());
                    orderDTO.setCancelled(order.isCancelled());
                    orderDTO.setOrderDate(order.getOrderDate());
                    return orderDTO;
                }).toList();

        return orders;
    }
        //TODO dodaj product quantity
    public Long orderLockIn(OrderDTO orderDTO, String token) {

        if(orderDTO.getId() != null) {
            orderRepository.deleteById(orderDTO.getId());
            orderProductRepository.deleteByOrderId(orderDTO.getId());
        }

        CustomerOrder order = new CustomerOrder();
        order.setId(orderDTO.getId());
        order.setOrderDate(orderDTO.getOrderDate());
        order.setPaid(orderDTO.isPaid());
        order.setCancelled(orderDTO.isCancelled());

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        Shop shop = shopRepository.findById(orderDTO.getShopId())
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        order.setShop(shop);
        order.setPerson(user);

        List<OrderProduct> orderProducts = new ArrayList<>();

        double total = 0;

        for (Map.Entry<ProductInfoDTO,Integer> entry : orderDTO.getOrderProducts().entrySet()) {

            ProductShop product = productShopRepository.findById(entry.getKey().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderProduct orderProduct = new OrderProduct();
            orderProduct.setOrder(order);
            orderProduct.setProductShop(product);
            orderProduct.setQuantity(entry.getValue());


            total += product.getPrice() * entry.getValue();

            orderProducts.add(orderProduct);
        }

        order.setOrderProducts(orderProducts);
        order.setTotal(total);

        CustomerOrder savedOrder = orderRepository.save(order);

        return savedOrder.getId();
    }

}
