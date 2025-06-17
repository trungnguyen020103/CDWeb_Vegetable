package com.example.demo.service;

import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.dto.MonthlyRevenueDto;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    @Autowired
    private UserRepository userRepo;
    @Autowired private ProductRepository productRepo;
    @Autowired private CategoryRepository categoryRepo;
    @Autowired private CommentRepository commentRepo;
    @Autowired private OrderRepository orderRepo;

    public DashboardStatsDto getDashboardStats(int year) {
        long totalUsers = userRepo.count();
        long totalProducts = productRepo.count();
        long totalCategories = categoryRepo.count();
        long totalComments = commentRepo.count();
        long totalOrders = orderRepo.count();

        List<Object[]> raw = orderRepo.revenuePerMonth(year);
        List<MonthlyRevenueDto> revenue = new ArrayList<>();
        double totalRevenue = 0; // Tổng doanh thu

        for (Object[] arr : raw) {
            Integer monthNumber = (Integer) arr[0];
            Double amount = ((Number) arr[1]).doubleValue();
            String monthName = Month.of(monthNumber).name();

            MonthlyRevenueDto dto = new MonthlyRevenueDto();
            dto.setMonth(monthName);
            dto.setRevenue(amount);

            revenue.add(dto);
            totalRevenue += amount;
        }

        DashboardStatsDto dto = new DashboardStatsDto();
        dto.setTotalUsers(totalUsers);
        dto.setTotalProducts(totalProducts);
        dto.setTotalCategories(totalCategories);
        dto.setTotalComments(totalComments);
        dto.setTotalOrders(totalOrders);
        dto.setTotalRevenue(totalRevenue);
        dto.setMonthlyRevenue(revenue);

        return dto;
    }


}
