package com.example.demo.dto;

import java.time.LocalDateTime;

public class ReviewDto {
    private Integer productId;
    private Integer userId;
    private Integer rating;
    private String comment;
    private LocalDateTime date;

    public ReviewDto() {}

    public ReviewDto(Integer productId, Integer userId, Integer rating, String comment, LocalDateTime date) {
        this.productId = productId;
        this.userId = userId;
        this.rating = rating;
        this.comment = comment;
        this.date = date;
    }

    // Getters and Setters
    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
}
