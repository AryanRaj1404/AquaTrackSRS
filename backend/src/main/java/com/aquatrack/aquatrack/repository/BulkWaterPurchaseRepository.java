package com.aquatrack.aquatrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.aquatrack.aquatrack.entity.BillingCycle;
import com.aquatrack.aquatrack.entity.BulkWaterPurchase;

public interface BulkWaterPurchaseRepository
        extends JpaRepository<BulkWaterPurchase, Long> {

    List<BulkWaterPurchase> findByBillingCycle(BillingCycle billingCycle);

    @Query("""
        SELECT COALESCE(SUM(b.volumeKl), 0)
        FROM BulkWaterPurchase b
        """)
    Double getTotalBulkWaterPurchasedKl();

    @Query("""
    SELECT COALESCE(SUM(b.volumeKl),0)
    FROM BulkWaterPurchase b
    WHERE b.apartment.id = :apartmentId
    """)
    Double getTotalBulkWaterPurchasedKl(
            Long apartmentId
    );

    boolean existsByBillingCycleId(Long billingCycleId);

}