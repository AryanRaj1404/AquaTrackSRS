package com.aquatrack.aquatrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aquatrack.aquatrack.entity.Apartment;

public interface ApartmentRepository extends JpaRepository<Apartment, Long>{
}
