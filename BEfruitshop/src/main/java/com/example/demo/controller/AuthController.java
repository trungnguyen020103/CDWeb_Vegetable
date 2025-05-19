package com.example.demo.controller;

import com.example.demo.dto.EmailVerifycationDto;
import com.example.demo.dto.UserSignUpDto;
import com.example.demo.model.AuthResponse;
import com.example.demo.model.User;
import com.example.demo.sendmail.EmailDetails;
import com.example.demo.sendmail.EmailService;
import com.example.demo.service.EmailVerifycationService;
import com.example.demo.untils.JwtUntils;
import com.example.demo.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    @Autowired private EmailService emailService;
    @Autowired
    private AuthenticationManager authenticationManager;
@Autowired
    EmailVerifycationService emailVerifycationService;
    @Autowired
    private JwtUntils jwtUntils;

    @Autowired
    private CustomUserDetailsService customerDetailService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            logger.info("Attempting login for email: {}", request.getEmail());

            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UserDetails userDetails = customerDetailService.loadUserByUsername(request.getEmail());

            String token = jwtUntils.generateToken(userDetails);
            String refreshToken = jwtUntils.generateRefreshToken(userDetails);

            AuthResponse response = new AuthResponse(
                token,           // Access token
                refreshToken,    // Refresh token
                jwtUntils.getExpirationTime(),  // Thời gian hết hạn
                "Bearer"        // Loại token
            );

            logger.info("Login successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed for email: {}. Error: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.status(403).body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserSignUpDto userDto) {
        try {
            User registeredUser = customerDetailService.register(userDto);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body("Đăng ký thất bại: " + e.getMessage());
        }
    }
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        if (refreshToken != null && refreshToken.startsWith("Bearer ")) {
            refreshToken = refreshToken.substring(7);
            String username = jwtUntils.extractUsername(refreshToken);

            if (username != null) {
                UserDetails userDetails = customerDetailService.loadUserByUsername(username);
                if (jwtUntils.validateToken(refreshToken, userDetails)) {
                    String newToken = jwtUntils.generateToken(userDetails);
                    String newRefreshToken = jwtUntils.generateRefreshToken(userDetails);

                    AuthResponse response = new AuthResponse(
                        newToken,
                        newRefreshToken,
                        jwtUntils.getExpirationTime(),
                        "Bearer"
                    );

                    return ResponseEntity.ok(response);
                }
            }
        }
        return ResponseEntity.badRequest().body("Invalid refresh token");
    }
    @PostMapping("/changepasswithcode")
    public ResponseEntity<?> changePasswordWithCode(@RequestBody EmailVerifycationDto dto) {
        boolean result = emailVerifycationService.changePasswordWithCode(dto);

        if (result) {
            return ResponseEntity.ok("Đổi mật khẩu thành công.");
        } else {
            return ResponseEntity.badRequest().body("Mã xác thực không hợp lệ hoặc đã hết hạn.");
        }
    }
// send tới mail 1 mã code
    @PostMapping("/sendmail")
    public String sendMail(@RequestBody EmailDetails details)
    {
        String status
                = emailService.sendSimpleMail(details);
        return status;
    }

    static class AuthRequest {
        private String email;
        private String password;

        public String getEmail() {
            return this.email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return this.password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
