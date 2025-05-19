package com.example.demo.controller;

import com.example.demo.dto.UserSignUpDto;
import com.example.demo.model.User;
import com.example.demo.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/user")
//@RequestMapping()
public class UserController {
    @Autowired
    CustomUserDetailsService customUserDetailsService;
    @GetMapping("/getAll")
    public ResponseEntity<?> getAllUser(){
        List<User> list  = customUserDetailsService.getAllUsers();
        return ResponseEntity.ok(list);
    }
    @GetMapping("/getbyid/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            User user = customUserDetailsService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with id: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

}
