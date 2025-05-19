package com.example.demo.repository;

import com.example.demo.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("SELECT p FROM Product p WHERE (:search IS NULL OR :search = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:category IS NULL OR p.category.id = :category)")
    Page<Product> findBySearchAndCategory(
            @Param("search") String search,
            @Param("category") Integer category,
            Pageable pageable);

    @Query("SELECT p FROM Product p WHERE (:search IS NULL OR :search = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:category IS NULL OR p.category.id = :category) " +
            "AND p.category.id = 7")
    Page<Product> findBestSelling(
            @Param("search") String search,
            @Param("category") Integer category,
            Pageable pageable);

    @Query("SELECT p FROM Product p WHERE (:search IS NULL OR :search = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:category IS NULL OR p.category.id = :category) " +
            "ORDER BY p.price ASC")
    Page<Product> findByPriceAsc(
            @Param("search") String search,
            @Param("category") Integer category,
            Pageable pageable);

    @Query("SELECT p FROM Product p WHERE (:search IS NULL OR :search = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:category IS NULL OR p.category.id = :category) " +
            "ORDER BY p.price DESC")
    Page<Product> findByPriceDesc(
            @Param("search") String search,
            @Param("category") Integer category,
            Pageable pageable);

    @Query("SELECT p FROM Product p WHERE (:search IS NULL OR :search = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:category IS NULL OR p.category.id = :category) " +
            "AND p.category.id = 8")
    Page<Product> findDiscounted(
            @Param("search") String search,
            @Param("category") Integer category,
            Pageable pageable);
}