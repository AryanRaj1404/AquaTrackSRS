package com.aquatrack.aquatrack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aquatrack.aquatrack.entity.User;
import com.aquatrack.aquatrack.enums.Role;

public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByMobileNumber(String mobileNumber);

    List<User> findByHouseholdId(Long householdId);

    List<User> findByRoleAndHouseholdIsNull(Role role);

    Optional<User> findFirstByHouseholdId(Long householdId);
}
