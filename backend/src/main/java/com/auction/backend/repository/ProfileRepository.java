package com.auction.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.auction.backend.model.Profile;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    
}
