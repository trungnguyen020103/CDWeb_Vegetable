package com.example.demo.dto;

public class MonthlyRevenueDto {
    private String month;
    private double revenue;

    public MonthlyRevenueDto(String month, double revenue) {
        this.month = month;
        this.revenue = revenue;
    }

    public MonthlyRevenueDto() {
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public double getRevenue() {
        return revenue;
    }

    public void setRevenue(double revenue) {
        this.revenue = revenue;
    }
}
