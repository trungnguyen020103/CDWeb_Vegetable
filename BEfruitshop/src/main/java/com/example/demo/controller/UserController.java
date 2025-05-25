package com.example.demo.controller;

import com.example.demo.dto.UserSignUpDto;
import com.example.demo.model.User;
import com.example.demo.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    CustomUserDetailsService customUserDetailsService;
    @Autowired
    MessageSource messageSource;

    @GetMapping("/getAll")
    @PreAuthorize("hasRole('ADMIN')") // Chỉ admin được truy cập
    public ResponseEntity<?> getAllUser() {
        List<User> list = customUserDetailsService.getAllUsers();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/getbyid/{id}")
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id") // Admin hoặc chính người dùng
    public ResponseEntity<?> getById(@PathVariable Long id, Locale locale) {
        try {
            User user = customUserDetailsService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(messageSource.getMessage("user_not_found", new Object[]{id}, locale));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(messageSource.getMessage("internal_server_error", null, locale));
        }
    }

    @PostMapping("/language")
    public ResponseEntity<?> setLanguage(@RequestBody LanguageRequest request, Locale locale) {
        try {
            customUserDetailsService.updateLanguage(request.getEmail(), request.getLanguage());
            return ResponseEntity.ok(messageSource.getMessage("language_updated_success", null, locale));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(messageSource.getMessage("user_not_found", new Object[]{request.getEmail()}, locale));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(messageSource.getMessage("internal_server_error", null, locale));
        }
    }

    static class LanguageRequest {
        private String email;
        private String language;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getLanguage() { return language; }
        public void setLanguage(String language) { this.language = language; }
    }
}