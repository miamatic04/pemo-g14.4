package com.example.backend.utils;

import com.example.backend.exception.OrderNotFoundException;
import com.example.backend.model.CustomerOrder;
import com.example.backend.model.Event;
import com.example.backend.model.OrderProduct;
import com.example.backend.model.ProductShop;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ProductShopRepository;
import com.example.backend.service.EventService;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
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

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventService eventService;

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

    @Scheduled(cron = "0 0 * * * *") // every hour
    public void processExpiredEvents() {
        List<Event> events = eventRepository.findAll(); // Fetch all events

        for (Event event : events) {
            if (isEventExpired(event) && !event.getFrequency().equals("one-time")) {
                String frequency = event.getFrequency();
                LocalDateTime nextOccurrence = getNextOccurrence(event.getDateTime(), frequency);

                // Delete the expired event
                eventRepository.delete(event);

                // Create and save a new event with updated dateTime
                Event newEvent = createNewEvent(event, nextOccurrence);
                eventRepository.save(newEvent);
            }
        }
    }

    // Check if the event has expired based on its dateTime + duration
    private boolean isEventExpired(Event event) {
        LocalDateTime eventEndTime = event.getDateTime().plusMinutes(event.getDuration());
        return LocalDateTime.now().isAfter(eventEndTime);
    }

    // Get the next occurrence of the event based on frequency
    private LocalDateTime getNextOccurrence(LocalDateTime currentDateTime, String frequency) {
        switch (frequency.toLowerCase()) {
            case "daily":
                return currentDateTime.plusDays(1);
            case "weekly":
                return currentDateTime.plusWeeks(1);
            case "biweekly":
                return currentDateTime.plusWeeks(2);
            case "monthly":
                return currentDateTime.plusMonths(1);
            case "bimonthly":
                return currentDateTime.plusMonths(2);
            case "quarterly":
                return currentDateTime.plusMonths(3);
            default:
                throw new IllegalArgumentException("Unknown frequency: " + frequency);
        }
    }

    // Create a new event based on the old event and the new dateTime
    private Event createNewEvent(Event oldEvent, LocalDateTime newDateTime) {
        Event newEvent = new Event();
        newEvent.setName(oldEvent.getName());
        newEvent.setDescription(oldEvent.getDescription());
        newEvent.setDateTime(newDateTime);
        newEvent.setFrequency(oldEvent.getFrequency());
        newEvent.setDuration(oldEvent.getDuration());
        newEvent.setAddress(oldEvent.getAddress());
        newEvent.setImagePath(oldEvent.getImagePath());
        newEvent.setShop(oldEvent.getShop());
        return newEvent;
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
