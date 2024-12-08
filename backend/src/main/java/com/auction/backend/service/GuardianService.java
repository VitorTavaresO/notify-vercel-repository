package com.auction.backend.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.auction.backend.model.Guardian;
import com.auction.backend.repository.GuardianRepository;

@Service
public class GuardianService {
    
    @Autowired
    private GuardianRepository guardianRepository;

    public Guardian create(Guardian guardian) {
        return guardianRepository.save(guardian);
    }

    public Guardian update(Guardian guardian) {
        return guardianRepository.save(guardian);
    }

    public List<Guardian> getAllGuardians() {
        return guardianRepository.findAll();
    }

    public Guardian getGuardianById(Long id) {
        return guardianRepository.findById(id).orElse(null);
    }
}
