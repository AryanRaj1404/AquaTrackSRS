package com.aquatrack.aquatrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aquatrack.aquatrack.entity.Household;

public interface HouseholdRepository extends JpaRepository<Household, Long>{
    List<Household> findByApartmentId(Long apartmentId);
}
