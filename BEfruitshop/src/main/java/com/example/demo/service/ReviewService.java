package com.example.demo.service;

import com.example.demo.dto.ReviewDto;
import com.example.demo.model.Review;
import com.example.demo.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review createReview(ReviewDto dto) {
        Review review = new Review();
        review.setProductId(dto.getProductId());
        review.setUserId(dto.getUserId());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setDate(dto.getDate());
        return reviewRepository.save(review);
    }

    public Review updateReview(Integer id, ReviewDto dto) {
        Optional<Review> optional = reviewRepository.findById(id);
        if (optional.isPresent()) {
            Review review = optional.get();
            review.setProductId(dto.getProductId());
            review.setUserId(dto.getUserId());
            review.setRating(dto.getRating());
            review.setComment(dto.getComment());
            review.setDate(dto.getDate());
            return reviewRepository.save(review);
        }
        throw new IllegalArgumentException("Review not found");
    }

    public boolean deleteReview(Integer id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Review getReviewById(Integer id) {
        return reviewRepository.findById(id).orElse(null);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByProductId(Integer productId) {
        return reviewRepository.findByProductId(productId);
    }
}
