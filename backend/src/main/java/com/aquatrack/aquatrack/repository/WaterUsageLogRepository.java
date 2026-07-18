package com.aquatrack.aquatrack.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.aquatrack.aquatrack.entity.WaterUsageLog;

public interface WaterUsageLogRepository extends JpaRepository<WaterUsageLog, Long>{
    List<WaterUsageLog> findByHouseholdId(Long householdId);
    List<WaterUsageLog> findByBillingCycleId(Long billingCycleId);

    boolean existsByBillingCycleId(Long billingCycleId);

    List<WaterUsageLog> findByBillingCycleIdAndHouseholdId(
        Long billingCycleId,
        Long householdId);
    boolean existsByHouseholdIdAndUsageDate(
        Long householdId,
        LocalDate usageDate
    );
    boolean existsByHouseholdIdAndUsageDateAndIdNot(
            Long householdId,
            LocalDate usageDate,
            Long id);
    
    @Query("""
        SELECT COALESCE(SUM(w.litersConsumed), 0)
        FROM WaterUsageLog w
        """)
    Double getTotalWaterConsumedLiters();
    @Query("""
    SELECT
    FUNCTION('TO_CHAR', w.usageDate, 'YYYY-MM'),
    COALESCE(SUM(w.litersConsumed)/1000.0,0)
    FROM WaterUsageLog w
    GROUP BY FUNCTION('TO_CHAR', w.usageDate, 'YYYY-MM')
    ORDER BY FUNCTION('TO_CHAR', w.usageDate, 'YYYY-MM')
    """)
    List<Object[]> getMonthlyConsumption();

    @Query("""
    SELECT
    h.id,
    h.flatNumber,
    COALESCE(SUM(w.litersConsumed)/1000.0,0)
    FROM WaterUsageLog w
    JOIN w.household h
    GROUP BY h.id,h.flatNumber
    ORDER BY SUM(w.litersConsumed) DESC
    """)
    List<Object[]> getTopHouseholds();


}
