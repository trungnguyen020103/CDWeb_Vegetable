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
import com.example.demo.service.CustomUserDetailsService;
import com.example.demo.service.EmailVerifycationService;
import com.example.demo.service.I18nService;
import com.example.demo.untils.JwtUntils;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private EmailService emailService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private EmailVerifycationService emailVerifycationService;
    @Autowired
    private JwtUntils jwtUntils;
    @Autowired
    private GoogleTokenVerifier googleTokenVerifier;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CustomUserDetailsService customerDetailService;
    @Autowired
    private I18nService i18nService;

    @PostMapping("/login/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody GoogleLoginRequest googleLoginRequest, Locale locale) {
        String googleToken = googleLoginRequest.getGoogleToken();
        if (googleToken == null || googleToken.isEmpty()) {
            logger.warn("Received null or empty Google token");
            return ResponseEntity.badRequest().body(i18nService.getMessage("login.failed", locale));
        }

        try {
            GoogleUserInfo userInfo = googleTokenVerifier.verifyTokenAndGetUserInfo(googleToken);

            if (userInfo == null || userInfo.getEmail() == null) {
                return ResponseEntity.status(401).body(i18nService.getMessage("login.failed", locale));
            }

            String email = userInfo.getEmail();
            String name = userInfo.getName();

            logger.info("Google login email: {}", email);

            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                GoogleSignUpDto googleDto = new GoogleSignUpDto(email, name);
                user = customerDetailService.registerFromGoogle(googleDto);
                logger.info("Tạo tài khoản mới cho người dùng Google: {}", email);
            }

            var userDetails = customerDetailService.loadUserByUsername(email);
            Long userId = customerDetailService.getUserIdByEmail(email);
            String token = jwtUntils.generateToken(userDetails);
            String refreshToken = jwtUntils.generateRefreshToken(userDetails);

            AuthResponse authResponse = new AuthResponse(
                    token,
                    refreshToken,
                    jwtUntils.getExpirationTime(),
                    "Bearer",
                    userId
            );

            logger.info("Google login successful for email: {}", email);
            return ResponseEntity.ok(authResponse);

        } catch (Exception e) {
            logger.error("Google login failed. Error: {}", e.getMessage(), e);
            return ResponseEntity.status(403).body(i18nService.getMessage("login.failed", locale));
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

            AuthResponse response = new AuthResponse(
                    token,
                    refreshToken,
                    jwtUntils.getExpirationTime(),
                    "Bearer",
                    idUser
            );

            logger.info("Login successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed for email: {}. Error: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.status(403).body(i18nService.getMessage("login.failed", locale));
        }
    }

    @PostMapping("/sendmail")
    public ResponseEntity<?> sendMail(@Valid @RequestBody EmailDetails details, BindingResult bindingResult, Locale locale) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), i18nService.getMessage(error.getDefaultMessage(), locale)));
            return ResponseEntity.badRequest().body(errors);
        }

        String status = emailService.sendSimpleMail(details);
        return ResponseEntity.ok(status);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserSignUpDto userDto, BindingResult result, Locale locale) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), i18nService.getMessage(error.getDefaultMessage(), locale)));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            User registeredUser = customerDetailService.register(userDto);
            return ResponseEntity.ok(i18nService.getMessage("register.success", locale));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(i18nService.getMessage("register.failed", locale));
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
                    AuthResponse response = new AuthResponse(
                            newToken,
                            newRefreshToken,
                            jwtUntils.getExpirationTime(),
                            "Bearer",
                            idUser
                    );

                    return ResponseEntity.ok(response);
                }
            }
        }
        return ResponseEntity.badRequest().body(i18nService.getMessage("login.failed", locale));
    }

    @PostMapping("/changepasswithcode")
    public ResponseEntity<?> changePasswordWithCode(@Valid @RequestBody EmailVerifycationDto dto, BindingResult result, Locale locale) {
        if (result.hasErrors()) {
            HashMap<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), i18nService.getMessage(error.getDefaultMessage(), locale)));
            return ResponseEntity.badRequest().body(errors);
        }

        boolean results = emailVerifycationService.changePasswordWithCode(dto);

        if (results) {
            return ResponseEntity.ok(i18nService.getMessage("change.password.success", locale));
        } else {
            return ResponseEntity.badRequest().body(i18nService.getMessage("change.password.invalid.code", locale));
        }
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