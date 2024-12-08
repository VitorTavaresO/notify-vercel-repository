package com.auction.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.auction.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByCpf(String cpf);
    Optional<User> findBySiape(String siape);
    Optional<User> findByEmail(String email);
    boolean existsByValidationCode(String validationCode);
    Optional<User> findByValidationCode(String validationCode);
}
