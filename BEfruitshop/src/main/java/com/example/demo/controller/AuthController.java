package com.example.demo.controller;

import com.example.demo.dto.ChangePassDto;
import com.example.demo.dto.EmailVerifycationDto;
import com.example.demo.dto.UserSignUpDto;
import com.example.demo.google.GoogleLoginRequest;
import com.example.demo.google.GoogleSignUpDto;
import com.example.demo.google.GoogleTokenVerifier;
import com.example.demo.google.GoogleUserInfo;
import com.example.demo.model.AuthResponse;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.sendmail.EmailDetails;
import com.example.demo.sendmail.EmailService;
import com.example.demo.service.EmailVerifycationService;
import com.example.demo.untils.JwtUntils;
import com.example.demo.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    @Autowired private EmailService emailService;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private EmailVerifycationService emailVerifycationService;
    @Autowired private JwtUntils jwtUntils;
    @Autowired private GoogleTokenVerifier googleTokenVerifier;
    @Autowired private CustomUserDetailsService customerDetailService;
    @Autowired private MessageSource messageSource;

    @PostMapping("/login/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody GoogleLoginRequest googleLoginRequest, Locale locale) {
        String googleToken = googleLoginRequest.getGoogleToken();
        if (googleToken == null || googleToken.isEmpty()) {
            logger.warn("Received null or empty Google token");
            return ResponseEntity.badRequest().body(messageSource.getMessage("google_token_missing", null, locale));
        }
        try {
            String email = googleTokenVerifier.verifyTokenAndGetEmail(googleToken);
            if (email == null) {
                return ResponseEntity.status(401).body(messageSource.getMessage("invalid_google_token", null, locale));
            }
            logger.info("Google login email: {}", email);
            var userDetails = customerDetailService.loadUserByUsername(email);
            Long userId = customerDetailService.getUserIdByEmail(email);
            String token = jwtUntils.generateToken(userDetails);
            String refreshToken = jwtUntils.generateRefreshToken(userDetails);
            AuthResponse authResponse = new AuthResponse(token, refreshToken, jwtUntils.getExpirationTime(), "Bearer", userId);
            logger.info("Google login successful for email: {}", email);
            Map<String, Object> response = new HashMap<>();
            response.put("message", messageSource.getMessage("login_success", null, locale));
            response.put("data", authResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Google login failed. Error: {}", e.getMessage(), e);
            return ResponseEntity.status(403).body(messageSource.getMessage("google_login_failed", new Object[]{e.getMessage()}, locale));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request, Locale locale) {
        try {
            logger.info("Attempting login for email: {}", request.getEmail());
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            UserDetails userDetails = customerDetailService.loadUserByUsername(request.getEmail());
            Long idUser = customerDetailService.getUserIdByEmail(request.getEmail());
            String token = jwtUntils.generateToken(userDetails);
            String refreshToken = jwtUntils.generateRefreshToken(userDetails);
            AuthResponse authResponse = new AuthResponse(token, refreshToken, jwtUntils.getExpirationTime(), "Bearer", idUser);
            logger.info("Login successful for email: {}", request.getEmail());
            Map<String, Object> response = new HashMap<>();
            response.put("message", messageSource.getMessage("login_success", null, locale));
            response.put("data", authResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed for email: {}. Error: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.status(403).body(messageSource.getMessage("login_failed", new Object[]{e.getMessage()}, locale));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserSignUpDto userDto, Locale locale) {
        try {
            User registeredUser = customerDetailService.register(userDto);
            Map<String, Object> response = new HashMap<>();
            response.put("message", messageSource.getMessage("register_success", null, locale));
            response.put("data", registeredUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(messageSource.getMessage("register_failed", new Object[]{e.getMessage()}, locale));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String refreshToken, Locale locale) {
        if (refreshToken != null && refreshToken.startsWith("Bearer ")) {
            refreshToken = refreshToken.substring(7);
            String username = jwtUntils.extractUsername(refreshToken);
            if (username != null) {
                UserDetails userDetails = customerDetailService.loadUserByUsername(username);
                if (jwtUntils.validateToken(refreshToken, userDetails)) {
                    String newToken = jwtUntils.generateToken(userDetails);
                    String newRefreshToken = jwtUntils.generateRefreshToken(userDetails);
                    Long idUser = customerDetailService.getUserIdByEmail(username);
                    AuthResponse response = new AuthResponse(newToken, newRefreshToken, jwtUntils.getExpirationTime(), "Bearer", idUser);
                    Map<String, Object> responseMap = new HashMap<>();
                    responseMap.put("message", messageSource.getMessage("refresh_token_success", null, locale));
                    responseMap.put("data", response);
                    return ResponseEntity.ok(responseMap);
                }
            }
        }
        return ResponseEntity.badRequest().body(messageSource.getMessage("invalid_refresh_token", null, locale));
    }

    @PostMapping("/changepasswithcode")
    public ResponseEntity<?> changePasswordWithCode(@RequestBody EmailVerifycationDto dto, Locale locale) {
        boolean result = emailVerifycationService.changePasswordWithCode(dto);
        if (result) {
            return ResponseEntity.ok(messageSource.getMessage("change_password_success", null, locale));
        } else {
            return ResponseEntity.badRequest().body(messageSource.getMessage("change_password_failed", null, locale));
        }
    }

    @PostMapping("/sendmail")
    public ResponseEntity<?> sendMail(@RequestBody EmailDetails details, Locale locale) {
        String status = emailService.sendSimpleMail(details, locale);
        if (status.startsWith("Mail Sent")) {
            return ResponseEntity.ok(messageSource.getMessage("email_sent", null, locale));
        } else {
            return ResponseEntity.badRequest().body(messageSource.getMessage("email_send_failed", null, locale));
        }
    }

    static class AuthRequest {
        private String email;
        private String password;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}