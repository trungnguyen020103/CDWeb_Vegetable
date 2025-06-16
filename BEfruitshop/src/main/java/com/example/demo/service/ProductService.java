package com.example.demo.service;

import com.example.demo.dto.ProductDto;
import com.example.demo.model.Category;
import com.example.demo.model.Product;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    public List<Product> getProductsByCategoryId(Integer categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product addProduct(ProductDto dto, String imageUrl) {
        Product product = new Product();
        Optional<Category> categoryOpt = categoryRepository.findById(dto.getCategoryId());
        if (categoryOpt.isPresent()) {
            product.setCategory(categoryOpt.get());
        } else {
            throw new IllegalArgumentException("Category not found with ID: " + dto.getCategoryId());
        }

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setImageUrl(imageUrl);

        return productRepository.save(product);
    }
    public Product updateProduct(Long id, ProductDto dto, String imageUrl) {
        Optional<Product> productOpt = productRepository.findById(id.intValue());
        if (productOpt.isEmpty()) {
            throw new IllegalArgumentException("Product not found with ID: " + id);
        }

        Product product = productOpt.get();

        Optional<Category> categoryOpt = categoryRepository.findById(dto.getCategoryId());
        if (categoryOpt.isPresent()) {
            product.setCategory(categoryOpt.get());
        }

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());

        if (imageUrl != null && !imageUrl.isEmpty()) {
            product.setImageUrl(imageUrl);
        }

        return productRepository.save(product);
    }

    // Xóa sản phẩm
    public boolean deleteProduct(Long id) {
        Optional<Product> productOpt = productRepository.findById(id.intValue());
        if (productOpt.isPresent()) {
            productRepository.deleteById(id.intValue());
            return true;
        }
        return false;
    }
}
