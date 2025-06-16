package com.example.demo.controller;

import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/admin/dashboard")
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats(
            @RequestParam(required = false) Integer year) {
        int y = (year != null ? year : LocalDate.now().getYear());
        DashboardStatsDto dto = dashboardService.getDashboardStats(y);
        return ResponseEntity.ok(dto);
    }
}
