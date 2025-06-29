package com.example.demo.service;

import com.example.demo.model.Order;
import com.example.demo.model.OrderDetails;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    ProductRepository productRepository;
    public Order addOrder(Order order, Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        User user = optionalUser.get();
        order.setUser(user);
        order.setOrderdate(LocalDateTime.now());

        // Không tính lại total, sử dụng total từ frontend
        if (order.getOrderDetails() != null) {
            for (OrderDetails detail : order.getOrderDetails()) {
                Integer productId = detail.getProduct().getId();
                Product product = productRepository.findById(productId)
                        .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
                detail.setProduct(product);
                detail.setUnitprice(product.getPrice());
                detail.setTotal(product.getPrice() * detail.getQuantity());
                detail.setOrder(order);
            }
        }

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUser_IdOrderByOrderdateDesc(userId);
    }
    public void deleteOrder(Integer orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new RuntimeException("Order not found with id: " + orderId);
        }
        orderRepository.deleteById(orderId);
    }
    public void updateOrderStatus(Integer orderId, String newStatus) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isEmpty()) {
            throw new RuntimeException("Order not found with id: " + orderId);
        }

        Order order = optionalOrder.get();
        order.setStatus(newStatus);
        orderRepository.save(order);
    }

    public Optional<Order> getOrderById(Integer id) {
        return orderRepository.findById(id);
    }
}
