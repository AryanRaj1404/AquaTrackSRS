package com.aquatrack.aquatrack.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.aquatrack.aquatrack.entity.Household;

public interface HouseholdRepository extends JpaRepository<Household, Long>{

    

    Page<Household> findAll(Pageable pageable);
    List<Household> findByApartmentId(Long apartmentId);
    boolean existsByApartmentIdAndFlatNumber(Long apartmentId, String flatNumber);
    boolean existsByApartmentIdAndFlatNumberAndIdNot(
        Long apartmentId,
        String flatNumber,
        Long id);

    long countByApartmentId(Long apartmentId);

    Page<Household> findByFlatNumberContainingIgnoreCase(
        String flatNumber,
        Pageable pageable
);

@Query("""
    SELECT DISTINCT h
    FROM Household h
    LEFT JOIN User u ON u.household = h
    WHERE
        LOWER(h.flatNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(h.apartment.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(CONCAT(u.firstName, ' ', u.lastName))
            LIKE LOWER(CONCAT('%', :keyword, '%'))
""")
Page<Household> search(
        @Param("keyword") String keyword,
        Pageable pageable
);

Page<Household> findByApartmentId(
        Long apartmentId,
        Pageable pageable
);
}
