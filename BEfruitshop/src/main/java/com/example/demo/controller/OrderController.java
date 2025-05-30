package com.example.demo.controller;

import com.example.demo.model.Order;
import com.example.demo.service.I18nService;
import com.example.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private I18nService i18nService;

    @PostMapping(value = "/add/user/{userId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = "application/json")
    public ResponseEntity<Order> createOrder(@RequestBody Order order, @PathVariable Long userId) {
        try {
            Order savedOrder = orderService.addOrder(order, userId);
            return ResponseEntity.ok(savedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/get/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orders);
    }

    @DeleteMapping("/delete/{orderId}")
    public ResponseEntity<String> deleteOrder(@PathVariable Integer orderId, Locale locale) {
        try {
            orderService.deleteOrder(orderId);
            return ResponseEntity.ok(i18nService.getMessage("order.delete.success", locale));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(i18nService.getMessage("order.delete.failed", new Object[]{orderId}, locale));
        }
    }

    @PutMapping("/update/{orderId}")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Integer orderId, @RequestParam String status, Locale locale) {
        try {
            orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(i18nService.getMessage("order.update.success", locale));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(i18nService.getMessage("order.update.failed", new Object[]{orderId}, locale));
        }
    }
}