package com.example.demo.repository;

import com.example.demo.model.CategoryTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryTranslationRepository extends JpaRepository<CategoryTranslation, Long> {
    List<CategoryTranslation> findByCategoryIdAndLanguage(Integer categoryId, String language);
}