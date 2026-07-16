package com.aquatrack.aquatrack.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aquatrack.aquatrack.dto.BulkWaterPurchaseRequest;
import com.aquatrack.aquatrack.dto.BulkWaterPurchaseResponse;
import com.aquatrack.aquatrack.entity.Apartment;
import com.aquatrack.aquatrack.entity.BillingCycle;
import com.aquatrack.aquatrack.entity.BulkWaterPurchase;
import com.aquatrack.aquatrack.exception.ResourceNotFoundException;
import com.aquatrack.aquatrack.repository.ApartmentRepository;
import com.aquatrack.aquatrack.repository.BillingCycleRepository;
import com.aquatrack.aquatrack.repository.BulkWaterPurchaseRepository;

@Service
public class BulkWaterPurchaseServiceImpl implements BulkWaterPurchaseService {

    private final BulkWaterPurchaseRepository repository;
    private final ApartmentRepository apartmentRepository;
    private final BillingCycleRepository billingCycleRepository;

    public BulkWaterPurchaseServiceImpl(
            BulkWaterPurchaseRepository repository,
            ApartmentRepository apartmentRepository,
            BillingCycleRepository billingCycleRepository) {

        this.repository = repository;
        this.apartmentRepository = apartmentRepository;
        this.billingCycleRepository = billingCycleRepository;
    }

    @Override
    public BulkWaterPurchaseResponse create(BulkWaterPurchaseRequest request) {

        Apartment apartment = apartmentRepository.findById(request.getApartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Apartment not found"));

        BillingCycle billingCycle = billingCycleRepository.findById(request.getBillingCycleId())
                .orElseThrow(() -> new ResourceNotFoundException("Billing cycle not found"));

        BulkWaterPurchase purchase = new BulkWaterPurchase();

        purchase.setApartment(apartment);
        purchase.setBillingCycle(billingCycle);
        purchase.setPurchaseDate(request.getPurchaseDate());
        purchase.setSource(request.getSource());
        purchase.setVolumeKl(request.getVolumeKl());
        purchase.setUnitCost(request.getUnitCost());

        purchase.setTotalCost(
                request.getVolumeKl() * request.getUnitCost());

        purchase.setSupplier(request.getSupplier());

        return toResponse(repository.save(purchase));
    }

    @Override
    public List<BulkWaterPurchaseResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public BulkWaterPurchaseResponse getById(Long id) {

        return toResponse(repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Purchase not found")));
    }

    @Override
    public void delete(Long id) {

        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Purchase not found");
        }

        repository.deleteById(id);
    }

    private BulkWaterPurchaseResponse toResponse(
            BulkWaterPurchase purchase) {

        return new BulkWaterPurchaseResponse(

                purchase.getId(),

                purchase.getApartment().getId(),

                purchase.getBillingCycle().getId(),

                purchase.getPurchaseDate(),

                purchase.getSource(),

                purchase.getVolumeKl(),

                purchase.getUnitCost(),

                purchase.getTotalCost(),

                purchase.getSupplier());
    }

}