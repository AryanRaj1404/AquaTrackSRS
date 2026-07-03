package com.aquatrack.aquatrack.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aquatrack.aquatrack.entity.User;
import java.util.List;


public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User> findByUsername(String username);
}
