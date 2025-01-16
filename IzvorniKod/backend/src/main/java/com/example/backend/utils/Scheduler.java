package com.example.backend.utils;

import com.example.backend.exception.OrderNotFoundException;
import com.example.backend.model.CustomerOrder;
import com.example.backend.model.OrderProduct;
import com.example.backend.model.ProductShop;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ProductShopRepository;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@EnableScheduling
public class Scheduler {

    @Autowired
    private OrderRepository orderRepository;

    private final ConcurrentHashMap<Long, AtomicInteger> orderTimers = new ConcurrentHashMap<>();
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductShopRepository productShopRepository;

    public void startOrderTimer(Long orderId, int durationInSeconds) {
        orderTimers.putIfAbsent(orderId, new AtomicInteger(durationInSeconds));
        System.out.println("Timer set");
    }

    @Scheduled(fixedRate = 1000)
    public void processOrderTimers() {
        orderTimers.forEach((orderId, timer) -> {
            int remainingTime = timer.decrementAndGet();
            if (remainingTime <= 0) {
                System.out.println("Order " + orderId + " is now inactive.");
                markOrderAsInactive(orderId);
                orderTimers.remove(orderId);
            }
        });
    }

    @Transactional
    public void markOrderAsInactive(Long orderId) {

        CustomerOrder order = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException("Order does not exist"));

        Hibernate.initialize(order.getOrderProducts());

        if(!order.isPaid()) {
            for(OrderProduct orderProduct : order.getOrderProducts()) {
                ProductShop product = orderProduct.getProductShop();
                product.setQuantity(product.getQuantity() + orderProduct.getQuantity());
                order.setActive(false);
                orderRepository.save(order);
                productShopRepository.save(product);
            }

            System.out.println("Order " + orderId + " set as inactive.");
        }
    }
}
