package com.example.demo.controller;

import com.example.demo.dto.UserSignUpDto;
import com.example.demo.model.User;
import com.example.demo.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/admin")
//@RequestMapping()
public class UserController {
    @Autowired
    CustomUserDetailsService customUserDetailsService;
    @GetMapping("/getAll")
    public ResponseEntity<?> getAllUser(){
        List<User> list  = customUserDetailsService.getAllUsers();
        return ResponseEntity.ok(list);
    }


}
