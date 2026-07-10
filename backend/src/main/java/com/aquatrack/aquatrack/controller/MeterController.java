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

import com.aquatrack.aquatrack.dto.MeterRequest;
import com.aquatrack.aquatrack.dto.MeterResponse;
import com.aquatrack.aquatrack.service.MeterService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/meters")
public class MeterController {

    private final MeterService meterService;

    public MeterController(MeterService meterService) {
        this.meterService = meterService;
    }

    @PostMapping
    public MeterResponse create(@Valid @RequestBody MeterRequest request) {
        return meterService.create(request);
    }

    @GetMapping
    public List<MeterResponse> getAll() {
        return meterService.getAll();
    }

    @GetMapping("/{id}")
    public MeterResponse getById(@PathVariable Long id) {
        return meterService.getById(id);
    }

    @GetMapping("/household/{householdId}")
    public List<MeterResponse> getByHousehold(@PathVariable Long householdId) {
        return meterService.getByHousehold(householdId);
    }

    @PutMapping("/{id}")
    public MeterResponse update(@PathVariable Long id,
                                @Valid @RequestBody MeterRequest request) {
        return meterService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        meterService.delete(id);
        return "Meter deleted successfully";
    }
}