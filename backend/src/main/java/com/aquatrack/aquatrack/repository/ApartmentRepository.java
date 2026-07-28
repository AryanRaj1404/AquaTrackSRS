package com.aquatrack.aquatrack.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.aquatrack.aquatrack.entity.Apartment;

public interface ApartmentRepository extends JpaRepository<Apartment, Long> {

    Page<Apartment> findAll(Pageable pageable);

    Page<Apartment> findByNameContainingIgnoreCaseOrAddressContainingIgnoreCase(
    String name,
    String address,
    Pageable pageable
);

}