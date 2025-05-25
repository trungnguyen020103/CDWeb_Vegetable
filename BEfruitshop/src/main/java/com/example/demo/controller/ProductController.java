package com.example.demo.controller;

import com.example.demo.model.Product;
import com.example.demo.model.ProductTranslation;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ProductTranslationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.NumberFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductTranslationRepository translationRepository;
    @Autowired
    private MessageSource messageSource;

    @GetMapping
    public Map<String, Object> getAllProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer category,
            @RequestParam(required = false) String sort,
            Locale locale) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Product> productPage;
        String searchQuery = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        switch (sort != null ? sort : "") {
            case "best_selling":
                productPage = productRepository.findBestSelling(searchQuery, category, pageable);
                break;
            case "price_asc":
                productPage = productRepository.findByPriceAsc(searchQuery, category, pageable);
                break;
            case "price_desc":
                productPage = productRepository.findByPriceDesc(searchQuery, category, pageable);
                break;
            case "discount":
                productPage = productRepository.findDiscounted(searchQuery, category, pageable);
                break;
            default:
                productPage = productRepository.findBySearchAndCategory(searchQuery, category, pageable);
                break;
        }

        String language = locale.getLanguage();
        List<Map<String, Object>> formattedProducts = productPage.getContent().stream().map(product -> {
            Map<String, Object> map = new HashMap<>();
            List<ProductTranslation> translations = translationRepository.findByProductIdAndLanguage(product.getId(), language);
            ProductTranslation translation = translations.isEmpty() ? null : translations.get(0);
            map.put("id", product.getId());
            map.put("name", translation != null ? translation.getName() : product.getName());
            map.put("description", translation != null ? translation.getDescription() : product.getDescription());
            map.put("price", product.getPrice()); // Trả về giá thô dưới dạng số
            map.put("stock", product.getStock());
            map.put("imageUrl", product.getImageUrl());
            map.put("category", product.getCategory());
            return map;
        }).toList();

        Map<String, Object> response = new HashMap<>();
        response.put("content", formattedProducts);
        response.put("currentPage", productPage.getNumber() + 1);
        response.put("totalItems", productPage.getTotalElements());
        response.put("totalPages", productPage.getTotalPages());
        return response;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Integer id, Locale locale) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            String language = locale.getLanguage();
            List<ProductTranslation> translations = translationRepository.findByProductIdAndLanguage(id, language);
            ProductTranslation translation = translations.isEmpty() ? null : translations.get(0);
            NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(locale);
            Map<String, Object> response = new HashMap<>();
            response.put("id", product.getId());
            response.put("name", translation != null ? translation.getName() : product.getName());
            response.put("description", translation != null ? translation.getDescription() : product.getDescription());
            response.put("price", currencyFormatter.format(product.getPrice()));
            response.put("stock", product.getStock());
            response.put("imageUrl", product.getImageUrl());
            response.put("category", product.getCategory());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404)
                    .body(messageSource.getMessage("product_not_found", new Object[]{id}, locale));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(messageSource.getMessage("internal_server_error", null, locale));
        }
    }
}