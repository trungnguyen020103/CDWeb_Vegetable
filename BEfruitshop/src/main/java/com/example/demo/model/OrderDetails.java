package com.example.demo.model;

import com.example.demo.model.Order;
import com.example.demo.model.Product;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "orderdetails")
public class OrderDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "orderid")
    @JsonBackReference
    private Order order;

    @ManyToOne
    @JoinColumn(name = "productid")
    private Product product;

    private Integer quantity;

    private double unitprice;

    private double total;

    public OrderDetails() {
    }

    public OrderDetails(Integer id, Order order, Product product, Integer quantity, double unitprice, double total) {
        this.id = id;
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.unitprice = unitprice;
        this.total = total;
    }

    // Getters và Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public double getUnitprice() {
        return unitprice;
    }

    public void setUnitprice(double unitprice) {
        this.unitprice = unitprice;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}
