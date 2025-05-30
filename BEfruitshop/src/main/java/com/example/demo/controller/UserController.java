package com.example.demo.controller;

import com.example.demo.dto.ChangePassDto;
import com.example.demo.model.User;
import com.example.demo.service.CustomUserDetailsService;
import com.example.demo.service.I18nService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", exposedHeaders = "*")
public class UserController {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    @Autowired
    private I18nService i18nService;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllUser() {
        List<User> list = customUserDetailsService.getAllUsers();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/getbyid/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id, Locale locale) {
        try {
            User user = customUserDetailsService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(i18nService.getMessage("user.not.found", new Object[]{id}, locale));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @PutMapping("/changepassword")
    public ResponseEntity<?> changePassWord(@Valid @RequestBody ChangePassDto changePassDto, BindingResult result, Locale locale) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), i18nService.getMessage(error.getDefaultMessage(), locale)));
            return ResponseEntity.badRequest().body(errors);
        }

        User updatedUser = customUserDetailsService.changePassword(changePassDto);
        return ResponseEntity.ok(i18nService.getMessage("change.password.success", locale));
    }
}