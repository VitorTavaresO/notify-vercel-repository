package com.auction.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.auction.backend.model.Guardian;

@Repository
public interface GuardianRepository extends JpaRepository<Guardian, Long> {

}
