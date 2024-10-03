package com.auction.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.auction.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
