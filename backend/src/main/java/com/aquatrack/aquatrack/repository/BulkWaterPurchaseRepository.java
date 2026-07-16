package com.aquatrack.aquatrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aquatrack.aquatrack.entity.BillingCycle;
import com.aquatrack.aquatrack.entity.BulkWaterPurchase;

public interface BulkWaterPurchaseRepository
        extends JpaRepository<BulkWaterPurchase, Long> {

    List<BulkWaterPurchase> findByBillingCycle(BillingCycle billingCycle);

}