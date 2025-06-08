package com.example.demo.repository;

import com.example.demo.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByProductIdAndStatusOrderByCreatedAtDesc(Integer productId, Comment.CommentStatus status);
    List<Comment> findByProductIdOrderByCreatedAtDesc(Integer productId);
    List<Comment> findByStatusOrderByCreatedAtDesc(Comment.CommentStatus status);
}