package com.aquatrack.aquatrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
}
