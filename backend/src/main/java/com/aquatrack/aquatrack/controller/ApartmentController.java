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

import com.aquatrack.aquatrack.dto.ApartmentRequest;
import com.aquatrack.aquatrack.dto.ApartmentResponse;
import com.aquatrack.aquatrack.service.ApartmentService;

@RestController
@RequestMapping("/apartments")
public class ApartmentController {

    private final ApartmentService apartmentService;

    public ApartmentController(ApartmentService apartmentService) {
        this.apartmentService = apartmentService;
    }

    @PostMapping
    public ApartmentResponse create(@RequestBody ApartmentRequest request) {
        return apartmentService.create(request);
    }

    @GetMapping
    public List<ApartmentResponse> getAll() {
        return apartmentService.getAll();
    }

    @GetMapping("/{id}")
    public ApartmentResponse getById(@PathVariable Long id) {
        return apartmentService.getById(id);
    }

    @PutMapping("/{id}")
    public ApartmentResponse update(@PathVariable Long id, @RequestBody ApartmentRequest request) {
        return apartmentService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        apartmentService.delete(id);
        return "Apartment deleted successfully";
    }
}
