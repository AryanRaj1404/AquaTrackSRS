package com.aquatrack.aquatrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.aquatrack.aquatrack.entity.Invoice;
import com.aquatrack.aquatrack.enums.InvoiceStatus;

public interface InvoiceRepository
        extends JpaRepository<Invoice, Long> {

    List<Invoice> findByBillingCycleId(Long billingCycleId);

    List<Invoice> findByHouseholdId(Long householdId);

    long countByStatus(InvoiceStatus status);

    @Query("""
        SELECT COALESCE(SUM(i.totalAmount), 0)
        FROM Invoice i
        """)
    Double getTotalRevenue();

    @Query("""
        SELECT
        FUNCTION('TO_CHAR', i.generatedDate, 'YYYY-MM'),
        COALESCE(SUM(i.totalAmount),0)
        FROM Invoice i
        GROUP BY FUNCTION('TO_CHAR', i.generatedDate, 'YYYY-MM')
        ORDER BY FUNCTION('TO_CHAR', i.generatedDate, 'YYYY-MM')
        """)
    List<Object[]> getMonthlyRevenue();

}