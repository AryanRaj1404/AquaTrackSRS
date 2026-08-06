package com.aquatrack.aquatrack.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    SELECT COALESCE(SUM(w.litersConsumed),0)
    FROM WaterUsageLog w
    WHERE w.household.apartment.id = :apartmentId
    """)
    Double getTotalWaterConsumedLiters(
            Long apartmentId
    );
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

    Page<WaterUsageLog> findAll(Pageable pageable);

    Page<WaterUsageLog> findByHousehold_FlatNumberContainingIgnoreCaseOrHousehold_Apartment_NameContainingIgnoreCase(
        String flatNumber,
        String apartmentName,
        Pageable pageable
);

    List<WaterUsageLog> findByHouseholdIdAndUsageDateBetween(
        Long householdId,
        LocalDate fromDate,
        LocalDate toDate
    );

    @Query("""
    SELECT
    FUNCTION('TO_CHAR', w.usageDate, 'YYYY-MM-DD'),
    COALESCE(SUM(w.litersConsumed)/1000.0,0)
    FROM WaterUsageLog w
    WHERE w.household.id = :householdId
    AND w.usageDate >= :fromDate
    GROUP BY FUNCTION('TO_CHAR', w.usageDate, 'YYYY-MM-DD')
    ORDER BY FUNCTION('TO_CHAR', w.usageDate, 'YYYY-MM-DD')
    """)
    List<Object[]> getDailyConsumptionByHousehold(
        Long householdId,
        LocalDate fromDate
    );

    @Query("""
    SELECT
    FUNCTION('TO_CHAR', w.usageDate, 'YYYY-MM'),
    COALESCE(SUM(w.litersConsumed)/1000.0,0)
    FROM WaterUsageLog w
    WHERE w.household.id = :householdId
    GROUP BY FUNCTION('TO_CHAR', w.usageDate, 'YYYY-MM')
    ORDER BY FUNCTION('TO_CHAR', w.usageDate, 'YYYY-MM')
    """)
    List<Object[]> getMonthlyConsumptionByHousehold(
        Long householdId
    );

    @Query("""
    SELECT COALESCE(SUM(w.litersConsumed)/1000.0,0)
    FROM WaterUsageLog w
    WHERE w.household.id = :householdId
    AND FUNCTION('TO_CHAR', w.usageDate, 'YYYY') =
        FUNCTION('TO_CHAR', CURRENT_DATE, 'YYYY')
    """)
    Double getYtdConsumptionKlByHousehold(
        Long householdId
    );

    @Query("""
    SELECT h.id, COALESCE(SUM(w.litersConsumed)/1000.0,0)
    FROM WaterUsageLog w
    JOIN w.household h
    WHERE w.billingCycle.id = :billingCycleId
    AND h.apartment.id = :apartmentId
    GROUP BY h.id
    """)
    List<Object[]> getHouseholdConsumptionForCycle(
        Long billingCycleId,
        Long apartmentId
    );

    @Query("""
    SELECT
        w.usageDate,
        COALESCE(SUM(w.litersConsumed)/1000.0,0)
    FROM WaterUsageLog w
    WHERE w.usageDate >= :startDate
    GROUP BY w.usageDate
    ORDER BY w.usageDate
    """)
    List<Object[]> getDailyConsumption(LocalDate startDate);

    @Query("""
    SELECT
        FUNCTION('TO_CHAR', w.usageDate, 'YYYY-MM'),
        COALESCE(SUM(w.litersConsumed)/1000.0,0)
    FROM WaterUsageLog w
    WHERE w.usageDate >= :startDate
    GROUP BY FUNCTION('TO_CHAR', w.usageDate, 'YYYY-MM')
    ORDER BY FUNCTION('TO_CHAR', w.usageDate, 'YYYY-MM')
    """)
    List<Object[]> getMonthlyConsumption(LocalDate startDate);

    @Query("""
    SELECT
        w.usageDate,
        COALESCE(SUM(w.litersConsumed)/1000.0,0)
    FROM WaterUsageLog w
    WHERE w.usageDate >= :startDate
    AND w.household.apartment.id = :apartmentId
    GROUP BY w.usageDate
    ORDER BY w.usageDate
    """)
    List<Object[]> getDailyConsumption(
            LocalDate startDate,
            Long apartmentId
    );

    @Query("""
    SELECT
        FUNCTION('TO_CHAR', w.usageDate, 'YYYY-MM'),
        COALESCE(SUM(w.litersConsumed)/1000.0,0)
    FROM WaterUsageLog w
    WHERE w.usageDate >= :startDate
    AND w.household.apartment.id = :apartmentId
    GROUP BY FUNCTION('TO_CHAR', w.usageDate, 'YYYY-MM')
    ORDER BY FUNCTION('TO_CHAR', w.usageDate, 'YYYY-MM')
    """)
    List<Object[]> getMonthlyConsumption(
            LocalDate startDate,
            Long apartmentId
    );

    @Query("""
    SELECT
        h.id,
        h.flatNumber,
        COALESCE(SUM(w.litersConsumed)/1000.0,0)
    FROM WaterUsageLog w
    JOIN w.household h
    WHERE h.apartment.id = :apartmentId
    GROUP BY h.id,h.flatNumber
    ORDER BY SUM(w.litersConsumed) DESC
    """)
    List<Object[]> getTopHouseholds(
            Long apartmentId
    );

    long countByHousehold_Apartment_Id(Long apartmentId);

    Page<WaterUsageLog> findByHousehold_Apartment_Id(
        Long apartmentId,
        Pageable pageable
);

Page<WaterUsageLog>
findByHousehold_Apartment_IdAndHousehold_FlatNumberContainingIgnoreCaseOrHousehold_Apartment_IdAndHousehold_Apartment_NameContainingIgnoreCase(
        Long apartmentId1,
        String flatNumber,
        Long apartmentId2,
        String apartmentName,
        Pageable pageable
);
}
