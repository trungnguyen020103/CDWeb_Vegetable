package com.example.demo.repository;

import com.example.demo.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUser_IdOrderByOrderdateDesc(Long userId);
    @Query("SELECT FUNCTION('MONTH', o.orderdate) AS m, SUM(o.total) " +
            "FROM Order o WHERE FUNCTION('YEAR', o.orderdate) = :year " +
            "GROUP BY FUNCTION('MONTH', o.orderdate)")
    List<Object[]> revenuePerMonth(@Param("year") int year);
}
