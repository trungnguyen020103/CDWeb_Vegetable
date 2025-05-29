package com.example.demo.controller;

import com.example.demo.dto.ChangePassDto;
import com.example.demo.model.User;
import com.example.demo.service.CustomUserDetailsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", exposedHeaders = "*")
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
    @PutMapping("/changepassword")
    public ResponseEntity<?> changePassWord(@Valid @RequestBody ChangePassDto changePassDto, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        User updatedUser = customUserDetailsService.changePassword(changePassDto);
        return ResponseEntity.ok("Đổi mật khẩu thành công cho người dùng: " + updatedUser.getEmail());
    }
}
