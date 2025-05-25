package com.example.demo.controller;

import com.example.demo.model.Category;
import com.example.demo.model.CategoryTranslation;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.CategoryTranslationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:3000")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private CategoryTranslationRepository translationRepository;

    @GetMapping
    public List<CategoryTranslation> getAllCategories(Locale locale) {
        String language = locale.getLanguage();
        List<Category> categories = categoryRepository.findAll();
        List<CategoryTranslation> translations = translationRepository.findAll();

        Map<Integer, CategoryTranslation> translationMap = translations.stream()
                .filter(t -> t.getLanguage().equals(language))
                .collect(Collectors.toMap(t -> t.getCategory().getId(), t -> t));

        return categories.stream().map(category -> {
            CategoryTranslation translation = translationMap.get(category.getId());
            if (translation == null) {
                translation = new CategoryTranslation();
                translation.setCategory(category);
                translation.setLanguage(language);
                translation.setName(category.getName());
                translation.setDescription(category.getDescription());
            }
            return translation;
        }).collect(Collectors.toList());
    }
}