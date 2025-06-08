package com.example.demo.controller;

import com.example.demo.dto.CommentDto;
import com.example.demo.service.CommentService;
import com.example.demo.service.I18nService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", exposedHeaders = "*")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @Autowired
    private I18nService i18nService;

    @PostMapping
    public ResponseEntity<?> createComment(@Valid @RequestBody CommentDto commentDto, BindingResult result, Locale locale) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), i18nService.getMessage(error.getDefaultMessage(), locale)));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            CommentDto createdComment = commentService.createComment(commentDto);
            return ResponseEntity.ok(Map.of(
                    "comment", createdComment,
                    "message", i18nService.getMessage("comment.create.pending", locale)
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(i18nService.getMessage("comment.create.error", new Object[]{e.getMessage()}, locale));
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<CommentDto>> getCommentsByProductId(@PathVariable Integer productId) {
        List<CommentDto> comments = commentService.getCommentsByProductId(productId);
        return ResponseEntity.ok(comments);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId, Locale locale) {
        try {
            commentService.deleteComment(commentId);
            return ResponseEntity.ok(i18nService.getMessage("comment.delete.success", locale));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(i18nService.getMessage("comment.delete.error", new Object[]{e.getMessage()}, locale));
        }
    }
}