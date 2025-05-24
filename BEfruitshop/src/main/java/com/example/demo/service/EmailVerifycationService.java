package com.example.demo.service;

import com.example.demo.dto.EmailVerifycationDto;
import com.example.demo.model.EmailVerifycation;
import com.example.demo.model.User;
import com.example.demo.repository.EmailVerifycationRepository;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class EmailVerifycationService {
@Autowired
UserRepository userRepository;
    @Autowired
    private EmailVerifycationRepository repository;

    public EmailVerifycation createVerification(EmailVerifycation emailVerification) {
        emailVerification.setTimeExpire(LocalDateTime.now().plusMinutes(10));
        return repository.save(emailVerification);
    }

    public void deleteById(String id) {
        repository.deleteById(id);
    }
    public boolean existsByEmail(String email) {
        return repository.findAll()
                .stream()
                .anyMatch(e -> e.getEmail().equalsIgnoreCase(email));
    }
    // xóa các email mà code hết hạn sau 10 phút
    @Transactional
    public void deleteExpiredVerifications() {
        repository.deleteByTimeExpireBefore(LocalDateTime.now());
    }
    public boolean checkCodeAndDeleteIfExpired(String email, String code) {
        List<EmailVerifycation> verifications = repository.findByEmailAndCode(email, code);
        boolean validCodeExists = false;
        for (EmailVerifycation verification : verifications) {
            if (verification.getTimeExpire().isAfter(LocalDateTime.now())) {
                validCodeExists = true;
            } else {
                repository.delete(verification);
            }
        }
        return validCodeExists;
    }

    public boolean checkCodeAndEmail(String email, String code) {
        List<EmailVerifycation> list = repository.findByEmailAndCode(email, code);
        for (EmailVerifycation v : list) {
            if (v.getTimeExpire().isAfter(LocalDateTime.now())) {
                return true;
            }
        }
        return false; // Không có code nào còn hạn
    }
    @Transactional
    public boolean changePasswordWithCode(EmailVerifycationDto dto) {
        List<EmailVerifycation> verifications = repository.findAllByEmail(dto.getEmail());

        if (verifications.isEmpty()) {
            return false;
        }

        Optional<EmailVerifycation> matchedCode = verifications.stream()
                .filter(v -> v.getCode().equals(dto.getCode()) && v.getTimeExpire().isAfter(LocalDateTime.now()))
                .findFirst();

        if (matchedCode.isEmpty()) {
            return false;
        }

        Optional<User> userOpt = userRepository.findByEmail(dto.getEmail());
        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode(dto.getNewPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);

        repository.delete(matchedCode.get());

        return true;
    }


}
