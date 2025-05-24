package com.example.demo.controller;

import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {
    @Autowired
    ProductService productService;
    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public Map<String, Object> getAllProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer category,
            @RequestParam(required = false) String sort) {
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

        Map<String, Object> response = new HashMap<>();
        response.put("content", productPage.getContent());
        response.put("currentPage", productPage.getNumber() + 1);
        response.put("totalItems", productPage.getTotalElements());
        response.put("totalPages", productPage.getTotalPages());

        return response;
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Integer categoryId) {
        return productService.getProductsByCategoryId(categoryId);
    }
}
