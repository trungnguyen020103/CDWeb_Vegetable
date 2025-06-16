package com.example.demo.controller;

import com.example.demo.dto.EditUserDto;
import com.example.demo.dto.UserSignUpDto;
import com.example.demo.model.User;
import com.example.demo.service.CustomUserDetailsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/user")
public class AdminUserController {

    @Autowired
    private CustomUserDetailsService userService;

    // Thêm user mới
    @PostMapping("/add")
    public ResponseEntity<User> addUser(@Valid @RequestBody UserSignUpDto dto) {
        User createdUser = userService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    // Cập nhật user
    @PutMapping("/update/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id,
                                           @Valid @RequestBody EditUserDto dto) {
        User updatedUser = userService.updateUserFromSignUpDto(id, dto);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }

    // Xoá user
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        return deleted
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }
    //update role
    @PutMapping("/changerole/{id}")
    public ResponseEntity<?> changeUserRole(@PathVariable Long id) {
        try {
            User updatedUser = userService.changeUserRole(id);
            return ResponseEntity.ok(updatedUser);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

}
