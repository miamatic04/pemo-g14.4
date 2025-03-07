package com.example.backend.service;

import com.example.backend.dto.OrderDTO;
import com.example.backend.dto.ProductInfoDTO;
import com.example.backend.enums.ActivityType;
import com.example.backend.dto.ModifyOrderDTO;
import com.example.backend.dto.ProductQuantity;
import com.example.backend.exception.*;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.utils.Scheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

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

    @Autowired
    private Scheduler scheduler;

    @Autowired
    private UserActivityRepository userActivityRepository;

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

                    List<ProductQuantity> product_quantity = new ArrayList<>();
                    double total = 0;

                    for(OrderProduct orderP : order.getOrderProducts()) {
                        product_quantity.add(new ProductQuantity(new ProductInfoDTO(orderP.getProductShop()), orderP.getQuantity()));
                        total += orderP.getQuantity() * orderP.getProductShop().getPrice();
                    }

                    orderDTO.setOrderProducts(product_quantity);
                    orderDTO.setTotal(total);
                    orderDTO.setPaid(order.isPaid());
                    orderDTO.setCancelled(order.isCancelled());
                    orderDTO.setOrderDate(order.getOrderDate());
                    orderDTO.setActive(order.isActive());
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

        List<OrderDTO> orders = user.getCustomerOrders()
                .stream()
                .filter(order ->  !order.isPaid() && !order.isCancelled())
                .map(order -> {
                    OrderDTO orderDTO = new OrderDTO();
                    orderDTO.setId(order.getId());

                    List<ProductQuantity> product_quantity = new ArrayList<>();
                    double total = 0;

                    for(OrderProduct orderP : order.getOrderProducts()) {
                        product_quantity.add(new ProductQuantity(new ProductInfoDTO(orderP.getProductShop()), orderP.getQuantity()));
                        total += orderP.getQuantity() * orderP.getProductShop().getPrice();
                    }

                    orderDTO.setOrderProducts(product_quantity);
                    orderDTO.setTotal(total);
                    orderDTO.setPaid(order.isPaid());
                    orderDTO.setCancelled(order.isCancelled());
                    orderDTO.setOrderDate(order.getOrderDate());
                    orderDTO.setActive(order.isActive());
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

        List<OrderDTO> orders = user.getCustomerOrders()
                .stream()
                .filter(order -> order.isPaid())
                .map(order -> {
                    OrderDTO orderDTO = new OrderDTO();
                    orderDTO.setId(order.getId());

                    List<ProductQuantity> product_quantity = new ArrayList<>();
                    double total = 0;

                    for(OrderProduct orderP : order.getOrderProducts()) {
                        product_quantity.add(new ProductQuantity(new ProductInfoDTO(orderP.getProductShop()), orderP.getQuantity()));
                        total += orderP.getQuantity() * orderP.getProductShop().getPrice();
                    }

                    orderDTO.setOrderProducts(product_quantity);
                    orderDTO.setTotal(total);
                    orderDTO.setPaid(order.isPaid());
                    orderDTO.setCancelled(order.isCancelled());
                    orderDTO.setOrderDate(order.getOrderDate());
                    orderDTO.setActive(order.isActive());
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

        List<OrderDTO> orders = user.getCustomerOrders()
                .stream()
                .filter(order -> order.isCancelled())
                .map(order -> {
                    OrderDTO orderDTO = new OrderDTO();
                    orderDTO.setId(order.getId());

                    List<ProductQuantity> product_quantity = new ArrayList<>();
                    double total = 0;

                    for(OrderProduct orderP : order.getOrderProducts()) {
                        product_quantity.add(new ProductQuantity(new ProductInfoDTO(orderP.getProductShop()), orderP.getQuantity()));
                        total += orderP.getQuantity() * orderP.getProductShop().getPrice();
                    }

                    orderDTO.setOrderProducts(product_quantity);
                    orderDTO.setTotal(total);
                    orderDTO.setPaid(order.isPaid());
                    orderDTO.setCancelled(order.isCancelled());
                    orderDTO.setOrderDate(order.getOrderDate());
                    orderDTO.setActive(order.isActive());
                    return orderDTO;
                }).toList();

        return orders;
    }


    /*public Long orderLockIn(OrderDTO orderDTO, String token) {

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
    } */

    public OrderDTO addToOrder(ModifyOrderDTO modifyOrderDTO, String token) {

        boolean newOrder = false;

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        if(modifyOrderDTO.getOrderId() != null) {
            for(CustomerOrder customerOrder : user.getCustomerOrders()) {
                if(!customerOrder.getId().equals(modifyOrderDTO.getOrderId()) && customerOrder.isActive()) {
                    scheduler.markOrderAsInactive(customerOrder.getId());
                }
            }
        }

        ProductShop productShop = productShopRepository.findById(modifyOrderDTO.getProductId()).orElseThrow(() -> new ProductNotFoundException("Product not found"));

        Shop shop = shopRepository.findById(productShop.getShop().getId()).orElseThrow(() -> new ShopNotFoundException("Shop not found"));

        CustomerOrder order;
        CustomerOrder savedOrder = null;
        if(modifyOrderDTO.getOrderId() == null) {
            order = new CustomerOrder(user);
            newOrder = true;
        } else {
            order = orderRepository.findById(modifyOrderDTO.getOrderId()).orElseThrow(() -> new OrderNotFoundException("Order not found"));

            if(!order.isActive())
                setOrderAsActive(order.getId());
        }

        if(modifyOrderDTO.getQuantity() > productShop.getQuantity())
            throw new NoProductInStockException("Available in stock: " + productShop.getQuantity());

        OrderProduct orderProduct = null;
        if(modifyOrderDTO.getQuantity() < 0) {
            for(OrderProduct oP : order.getOrderProducts()) {
                if(oP.getProductShop().getId().equals(modifyOrderDTO.getProductId())) {
                    orderProduct = oP;
                    break;
                }
            }

            if(orderProduct != null) {
                orderProduct.setQuantity(orderProduct.getQuantity() + modifyOrderDTO.getQuantity());
                productShop.setQuantity(productShop.getQuantity() - modifyOrderDTO.getQuantity());
                productShopRepository.save(productShop);
                savedOrder = orderRepository.save(order);
            }
        } else {
            orderProduct = new OrderProduct();
            orderProduct.setOrder(order);
            orderProduct.setProductShop(productShop);
            orderProduct.setQuantity(modifyOrderDTO.getQuantity());

            boolean productExists = false;

            for (OrderProduct existingOrderProduct : order.getOrderProducts()) {
                if (existingOrderProduct.getProductShop().getId().equals(orderProduct.getProductShop().getId())) {
                    // Product already exists, update the quantity
                    existingOrderProduct.setQuantity(existingOrderProduct.getQuantity() + orderProduct.getQuantity());
                    productExists = true;
                    break;
                }
            }

            if (!productExists) {
                // Product does not exist, add the new OrderProduct to the list
                order.getOrderProducts().add(orderProduct);
            }

            productShop.setQuantity(productShop.getQuantity() - modifyOrderDTO.getQuantity());

            productShopRepository.save(productShop);
            savedOrder = orderRepository.save(order);

            if(newOrder) {
                scheduler.startOrderTimer(savedOrder.getId(), 60);
            }
        }


        UserActivity userActivity = new UserActivity();
        userActivity.setUser(user);
        userActivity.setActivityType(ActivityType.ADDED_TO_CART);
        userActivity.setDateTime(LocalDateTime.now());
        userActivity.setNote("Added " + modifyOrderDTO.getQuantity() + " x product with id = " + modifyOrderDTO.getProductId() + " to order with id = " + savedOrder.getId());
        userActivityRepository.save(userActivity);

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(savedOrder.getId());
        orderDTO.setOrderDate(savedOrder.getOrderDate());
        orderDTO.setPaid(savedOrder.isPaid());
        orderDTO.setCancelled(savedOrder.isCancelled());
        orderDTO.setActive(savedOrder.isActive());

        List<ProductQuantity> product_quantity = new ArrayList<>();
        double total = 0;

        for(OrderProduct orderP : savedOrder.getOrderProducts()) {
            product_quantity.add(new ProductQuantity(new ProductInfoDTO(orderP.getProductShop()), orderP.getQuantity()));
            total += orderP.getQuantity() * orderP.getProductShop().getPrice();
        }

        orderDTO.setOrderProducts(product_quantity);
        orderDTO.setTotal(total);
        order.setTotal(total);

        return orderDTO;
    }

    private void setOrderAsActive(Long id) {

        CustomerOrder order = orderRepository.findById(id).orElseThrow(() -> new OrderNotFoundException("Order not found"));

        for(OrderProduct orderProduct: order.getOrderProducts()) {
            ProductShop productShop = orderProduct.getProductShop();
            if(productShop.getQuantity() - orderProduct.getQuantity() < 0)
                throw new NoProductInStockException("Available in stock: " + productShop.getQuantity());
            else
                productShop.setQuantity(productShop.getQuantity() - orderProduct.getQuantity());

            productShopRepository.save(productShop);
        }

        order.setActive(true);
        orderRepository.save(order);
        scheduler.startOrderTimer(order.getId(), 60);
    }

    public OrderDTO removeFromOrder(ModifyOrderDTO modifyOrderDTO, String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        CustomerOrder order = orderRepository.findById(modifyOrderDTO.getOrderId()).orElseThrow(() -> new OrderNotFoundException("Order not found"));

        int index = -1;

        for(int i = 0; i < order.getOrderProducts().size(); i++) {
            if(order.getOrderProducts().get(i).getProductShop().getId().equals(modifyOrderDTO.getProductId())) {
                index = i;
                break;
            }
        }


        if(index != -1) {
            Integer quantity = modifyOrderDTO.getQuantity();
            ProductShop product = order.getOrderProducts().get(index).getProductShop();
            product.setQuantity(product.getQuantity() + quantity);
            order.getOrderProducts().remove(index);
            productShopRepository.save(product);
        }

        CustomerOrder savedOrder = orderRepository.save(order);

        UserActivity userActivity = new UserActivity();
        userActivity.setUser(user);
        userActivity.setActivityType(ActivityType.REMOVED_FROM_CART);
        userActivity.setDateTime(LocalDateTime.now());
        userActivity.setNote("Removed product with id = " + modifyOrderDTO.getProductId() + " from order with id = " + savedOrder.getId());
        userActivityRepository.save(userActivity);

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(savedOrder.getId());
        orderDTO.setOrderDate(savedOrder.getOrderDate());
        orderDTO.setPaid(savedOrder.isPaid());
        orderDTO.setCancelled(savedOrder.isCancelled());

        List<ProductQuantity> product_quantity = new ArrayList<>();
        double total = 0;

        for(OrderProduct orderP : order.getOrderProducts()) {
            product_quantity.add(new ProductQuantity(new ProductInfoDTO(orderP.getProductShop()), orderP.getQuantity()));
            total += orderP.getQuantity() * orderP.getProductShop().getPrice();
        }

        orderDTO.setOrderProducts(product_quantity);
        orderDTO.setTotal(total);

        return orderDTO;
    }

    public String payOrder(Long orderId) {
        CustomerOrder order = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException("Order not found"));

        order.setPaid(true);
        order.setActive(false);
        orderRepository.save(order);
        return "Successfully paid order";
    }

    public OrderDTO getOrder(Long orderId, String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        CustomerOrder order = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException("Order not found"));

        if(!order.getPerson().getEmail().equals(email)) {
            throw new OrderDoesntBelongToUserException("Order does not belong to this user.");
        }

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(order.getId());
        orderDTO.setOrderDate(order.getOrderDate());
        orderDTO.setPaid(order.isPaid());
        orderDTO.setCancelled(order.isCancelled());

        List<ProductQuantity> product_quantity = new ArrayList<>();
        double total = 0;

        for(OrderProduct orderP : order.getOrderProducts()) {
            product_quantity.add(new ProductQuantity(new ProductInfoDTO(orderP.getProductShop()), orderP.getQuantity()));
            total += orderP.getQuantity() * orderP.getProductShop().getPrice();
        }

        orderDTO.setOrderProducts(product_quantity);
        orderDTO.setTotal(total);

        return orderDTO;
    }

    public OrderDTO getActiveOrder(String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        Optional<CustomerOrder> orderOpt = orderRepository.findByPersonEmailAndActive(email, true);

        OrderDTO orderDTO = new OrderDTO();

        if (orderOpt.isPresent()) {
            CustomerOrder order = orderOpt.get();

            orderDTO.setId(order.getId());
            orderDTO.setOrderDate(order.getOrderDate());
            orderDTO.setPaid(order.isPaid());
            orderDTO.setCancelled(order.isCancelled());

            List<ProductQuantity> product_quantity = new ArrayList<>();
            double total = 0;

            for(OrderProduct orderP : order.getOrderProducts()) {
                product_quantity.add(new ProductQuantity(new ProductInfoDTO(orderP.getProductShop()), orderP.getQuantity()));
                total += orderP.getQuantity() * orderP.getProductShop().getPrice();
            }

            orderDTO.setOrderProducts(product_quantity);
            orderDTO.setTotal(total);

        } else {
            System.out.println("No active order found for the person with email: " + email);
            orderDTO.setId(null);
        }

        return orderDTO;
    }

    public String cancelOrder(Long orderId, String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        CustomerOrder order = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException("Order not found"));

        if(!order.getPerson().getEmail().equals(email)) {
            throw new OrderDoesntBelongToUserException("Order does not belong to this user.");
        }

        order.setCancelled(true);
        orderRepository.save(order);

        return "Order cancelled.";
    }

    public Map<String, Object> activateOrder(Long orderId, String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        CustomerOrder order = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException("Order not found"));

        if(!order.getPerson().getEmail().equals(email)) {
            throw new OrderDoesntBelongToUserException("Order does not belong to this user.");
        }

        for(CustomerOrder o : user.getCustomerOrders()) {
            if(o.isActive())
                o.setActive(false);
        }

        personRepository.save(user);

        for(OrderProduct orderProduct: order.getOrderProducts()) {
            ProductShop productShop = orderProduct.getProductShop();
            if(productShop.getQuantity() - orderProduct.getQuantity() < 0)
                throw new NoProductInStockException("Available in stock: " + productShop.getQuantity());
            else
                productShop.setQuantity(productShop.getQuantity() - orderProduct.getQuantity());

            productShopRepository.save(productShop);
        }

        order.setActive(true);
        orderRepository.save(order);
        scheduler.startOrderTimer(order.getId(), 60);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Activated order.");

        return response;

    }

}
