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
        // Tìm mã xác thực theo email
        EmailVerifycation emailVerification = repository.findByEmail(dto.getEmail());

        // Kiểm tra mã xác thực có hợp lệ không
        if (emailVerification == null || !emailVerification.getCode().equals(dto.getCode())) {
            return false;
        }

        // Kiểm tra thời gian hết hạn
        if (emailVerification.getTimeExpire().isBefore(LocalDateTime.now())
        ) {
            return false;
        }

        Optional<User> userOpt = userRepository.findByEmail(dto.getEmail());
        if (userOpt.isEmpty()) {
            return false;
        }
        User user = userOpt.get();

        // Mã hóa mật khẩu mới
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode(dto.getNewPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);

        // Xóa mã xác thực đã dùng
        repository.delete(emailVerification);

        return true;
    }


}
