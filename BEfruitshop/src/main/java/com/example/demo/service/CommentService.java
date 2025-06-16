package com.example.demo.service;

import com.example.demo.dto.CommentDto;
import com.example.demo.model.Comment;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public CommentDto createComment(CommentDto commentDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(commentDto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Comment comment = new Comment();
        comment.setContent(commentDto.getContent());
        comment.setUser(user);
        comment.setProduct(product);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setStatus(Comment.CommentStatus.PENDING);

        Comment savedComment = commentRepository.save(comment);

        CommentDto result = new CommentDto();
        result.setId(savedComment.getId());
        result.setContent(savedComment.getContent());
        result.setUserFullname(user.getFullname());
        result.setUserId(user.getId());
        result.setProductId(product.getId());
        result.setCreatedAt(savedComment.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
        result.setStatus(savedComment.getStatus().name());

        return result;
    }

    public List<CommentDto> getCommentsByProductId(Integer productId) {
        List<Comment> comments = commentRepository.findByProductIdAndStatusOrderByCreatedAtDesc(productId, Comment.CommentStatus.APPROVED);
        return comments.stream().map(comment -> {
            CommentDto dto = new CommentDto();
            dto.setId(comment.getId());
            dto.setContent(comment.getContent());
            dto.setUserFullname(comment.getUser().getFullname());
            dto.setUserId(comment.getUser().getId());
            dto.setProductId(comment.getProduct().getId());
            dto.setCreatedAt(comment.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            dto.setStatus(comment.getStatus().name());
            return dto;
        }).collect(Collectors.toList());
    }
    public List<CommentDto> getAllComments() {
        List<Comment> comments = commentRepository.findAll();
        List<CommentDto> result = new ArrayList<>();

        for (Comment comment : comments) {
            CommentDto dto = new CommentDto();
            dto.setId(comment.getId());
            dto.setContent(comment.getContent());
            dto.setUserFullname(comment.getUser().getFullname());
            dto.setUserId(comment.getUser().getId());
            dto.setProductId(comment.getProduct().getId());
            dto.setCreatedAt(comment.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            dto.setStatus(comment.getStatus().name());
            result.add(dto);
        }
        return result;
    }

    public void deleteComment(Long commentId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (comment.getUser().getId() != user.getId()) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }
    public void deleteCommentAsAdmin(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        commentRepository.delete(comment);
    }
    public void updateStatus(Long commentId, String status) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        comment.setStatus(Comment.CommentStatus.valueOf(status));
        commentRepository.save(comment);
    }
}
