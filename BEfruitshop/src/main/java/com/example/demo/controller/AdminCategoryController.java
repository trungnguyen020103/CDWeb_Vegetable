package com.example.demo.controller;

import com.example.demo.dto.CategoryDto;
import com.example.demo.model.Category;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/admin/category")
public class AdminCategoryController {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private CategoryService categoryService;
    @PostMapping("/add")
    public ResponseEntity<Category> add(@RequestBody CategoryDto categoryDto) {
        Category created = categoryService.addCategory(categoryDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    @PutMapping("/update/{id}")
    public Category update(@PathVariable Integer id, @RequestBody Category category) {
        return categoryService.updateCategory(id, category);
    }
    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Integer id) {
        return categoryService.deleteCategory(id) ? "Deleted" : "Not found";
    }
}
