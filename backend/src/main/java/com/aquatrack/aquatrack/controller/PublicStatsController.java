package com.aquatrack.aquatrack.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aquatrack.aquatrack.dto.DashboardStatsResponse;
import com.aquatrack.aquatrack.repository.ApartmentRepository;
import com.aquatrack.aquatrack.repository.HouseholdRepository;
import com.aquatrack.aquatrack.repository.UserRepository;
import com.aquatrack.aquatrack.repository.WaterUsageLogRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PublicStatsController {

    private final ApartmentRepository apartmentRepository;
    private final HouseholdRepository householdRepository;
    private final UserRepository userRepository;
    private final WaterUsageLogRepository waterUsageLogRepository;

    @GetMapping("/stats")
    public DashboardStatsResponse getStats() {

        double totalUsage =
                waterUsageLogRepository.findAll()
                        .stream()
                        .mapToDouble(log -> log.getLitersConsumed())
                        .sum();

        return new DashboardStatsResponse(
                apartmentRepository.count(),
                householdRepository.count(),
                userRepository.count(),
                totalUsage
        );
    }
}