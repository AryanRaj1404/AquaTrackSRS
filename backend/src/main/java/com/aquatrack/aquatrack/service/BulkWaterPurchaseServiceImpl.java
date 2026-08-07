package com.aquatrack.aquatrack.service;

import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

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
    public BulkWaterPurchaseResponse create(
        Long apartmentId,
        BulkWaterPurchaseRequest request) {

        Apartment apartment = apartmentRepository.findById(apartmentId)
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
public Page<BulkWaterPurchaseResponse> getAll(
        Long apartmentId,

        int page,

        int size

) {

    Page<BulkWaterPurchase> purchases;

if (apartmentId == null) {

    purchases = repository.findAll(
            PageRequest.of(page, size)
    );

} else {

    purchases = repository.findByApartment_Id(
            apartmentId,
            PageRequest.of(page, size)
    );

}

return purchases.map(this::toResponse);

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

    @Override
    public BulkWaterPurchaseResponse update(
        Long apartmentId,
            Long id,
            BulkWaterPurchaseRequest request) {

        BulkWaterPurchase purchase = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Purchase not found"));

        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Apartment not found"));

        BillingCycle billingCycle = billingCycleRepository
                .findById(request.getBillingCycleId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Billing cycle not found"));

        purchase.setApartment(apartment);
        purchase.setBillingCycle(billingCycle);
        purchase.setPurchaseDate(request.getPurchaseDate());
        purchase.setSource(request.getSource());
        purchase.setVolumeKl(request.getVolumeKl());
        purchase.setUnitCost(request.getUnitCost());

        purchase.setTotalCost(
                request.getVolumeKl() *
                request.getUnitCost());

        purchase.setSupplier(request.getSupplier());

        return toResponse(repository.save(purchase));
    }

    private BulkWaterPurchaseResponse toResponse(
            BulkWaterPurchase purchase) {
                BillingCycle billingCycle =
            purchase.getBillingCycle();

                String billingCycleMonth =

        billingCycle
                .getStartDate()
                .getMonth()
                .getDisplayName(
                        TextStyle.FULL,
                        Locale.ENGLISH
                )

        + " "

        + billingCycle
                .getStartDate()
                .getYear();

        return new BulkWaterPurchaseResponse(

                purchase.getId(),

                purchase.getApartment().getId(),

                purchase.getApartment().getName(),

                billingCycleMonth,

                billingCycle.getId(),

                purchase.getPurchaseDate(),

                purchase.getSource(),

                purchase.getVolumeKl(),

                purchase.getUnitCost(),

                purchase.getTotalCost(),

                purchase.getSupplier());
    }

}