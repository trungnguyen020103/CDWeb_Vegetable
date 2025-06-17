package com.example.demo.dto;

import java.util.List;
public class DashboardStatsDto {
    private long totalUsers;
    private long totalProducts;
    private long totalCategories;
    private long totalComments;
    private long totalOrders;
    private double totalRevenue;
    private List<MonthlyRevenueDto> monthlyRevenue;

    // Getters & Setters
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public long getTotalCategories() { return totalCategories; }
    public void setTotalCategories(long totalCategories) { this.totalCategories = totalCategories; }

    public long getTotalComments() { return totalComments; }
    public void setTotalComments(long totalComments) { this.totalComments = totalComments; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public List<MonthlyRevenueDto> getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(List<MonthlyRevenueDto> monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }

    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalUsers, long totalProducts, long totalCategories, long totalComments,
                             long totalOrders, double totalRevenue, List<MonthlyRevenueDto> monthlyRevenue) {
        this.totalUsers = totalUsers;
        this.totalProducts = totalProducts;
        this.totalCategories = totalCategories;
        this.totalComments = totalComments;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.monthlyRevenue = monthlyRevenue;
    }
}


