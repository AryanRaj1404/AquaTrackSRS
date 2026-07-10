package com.aquatrack.aquatrack.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aquatrack.aquatrack.dto.TariffPlanRequest;
import com.aquatrack.aquatrack.dto.TariffPlanResponse;
import com.aquatrack.aquatrack.service.TariffPlanService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/tariff-plans")
public class TariffPlanController {

    private final TariffPlanService tariffPlanService;

    public TariffPlanController(TariffPlanService tariffPlanService) {
        this.tariffPlanService = tariffPlanService;
    }

    @PostMapping
    public TariffPlanResponse create(@Valid @RequestBody TariffPlanRequest request) {
        return tariffPlanService.create(request);
    }

    @GetMapping
    public List<TariffPlanResponse> getAll() {
        return tariffPlanService.getAll();
    }

    @GetMapping("/{id}")
    public TariffPlanResponse getById(@PathVariable Long id) {
        return tariffPlanService.getById(id);
    }

    @PutMapping("/{id}")
    public TariffPlanResponse update(@PathVariable Long id,
                                     @Valid @RequestBody TariffPlanRequest request) {
        return tariffPlanService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        tariffPlanService.delete(id);
        return "Tariff plan deleted successfully";
    }
}