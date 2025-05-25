package com.example.demo.repository;

import com.example.demo.model.ProductTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductTranslationRepository extends JpaRepository<ProductTranslation, Long> {
    List<ProductTranslation> findByProductIdAndLanguage(Integer productId, String language);
}