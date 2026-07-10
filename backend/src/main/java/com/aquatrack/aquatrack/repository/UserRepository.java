package com.aquatrack.aquatrack.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aquatrack.aquatrack.entity.User;

public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByMobileNumber(String mobileNumber);

    List<User> findByHouseholdId(Long householdId);
}
