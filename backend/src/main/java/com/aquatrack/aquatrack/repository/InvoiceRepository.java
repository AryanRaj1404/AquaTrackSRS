package com.aquatrack.aquatrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aquatrack.aquatrack.entity.Invoice;

public interface InvoiceRepository
        extends JpaRepository<Invoice, Long> {

    List<Invoice> findByBillingCycleId(Long billingCycleId);

    List<Invoice> findByHouseholdId(Long householdId);

}