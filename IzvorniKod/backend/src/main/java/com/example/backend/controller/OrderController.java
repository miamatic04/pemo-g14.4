package com.example.backend.controller;

import com.example.backend.dto.ModifyOrderDTO;
import com.example.backend.dto.OrderDTO;
import com.example.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/addToOrder")
    public ResponseEntity<OrderDTO> addToOrder(@RequestBody ModifyOrderDTO modifyOrderDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(orderService.addToOrder(modifyOrderDTO, authHeader.substring(7)));
    }

    @PostMapping("/removeFromOrder")
    public ResponseEntity<OrderDTO> removeFromOrder(@RequestBody ModifyOrderDTO modifyOrderDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(orderService.removeFromOrder(modifyOrderDTO, authHeader.substring(7)));
    }

    @GetMapping("/getOrder/{orderId}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long orderId, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(orderService.getOrder(orderId, authHeader.substring(7)));
    }

    @GetMapping("/getAllOrders")
    public ResponseEntity<List<OrderDTO>> getAllOrders(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(orderService.getAllOrders(authHeader.substring(7)));
    }

    @PostMapping("/cancelOrder")
    public ResponseEntity<String> cancelOrder(@RequestBody OrderDTO orderDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(orderService.cancelOrder(orderDTO.getId(), authHeader.substring(7)));
    }

    @PostMapping("/activateOrder")
    public ResponseEntity<Map<String, Object>> activateOrder(@RequestBody OrderDTO orderDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(orderService.activateOrder(orderDTO.getId(), authHeader.substring(7)));
    }

    @PostMapping("/payOrder/{orderId}")
    public ResponseEntity<String> payOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.payOrder(orderId));
    }
}
