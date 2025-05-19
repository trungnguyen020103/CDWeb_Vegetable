package com.example.demo.repository;

import com.example.demo.model.EmailVerifycation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EmailVerifycationRepository extends JpaRepository<EmailVerifycation,String> {
    List<EmailVerifycation> findByTimeExpireBefore(LocalDateTime now);
    List<EmailVerifycation> findByEmailAndCode(String email, String code);

    void deleteByTimeExpireBefore(LocalDateTime now);

    EmailVerifycation findByEmail(String email);
}
