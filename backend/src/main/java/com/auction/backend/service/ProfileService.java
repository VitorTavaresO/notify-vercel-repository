package com.auction.backend.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auction.backend.model.Profile;
import com.auction.backend.repository.ProfileRepository;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    public Profile create(Profile profile){
        return profileRepository.save(profile);
    }

    public Profile read(Long id){
        return profileRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Profile not found"));
    }

    public Profile update(Profile profile){
        Profile savedProfile = profileRepository.findById(profile.getId()).orElseThrow(() -> new NoSuchElementException("Profile not found"));
        savedProfile.setName(profile.getName());
        return profileRepository.save(savedProfile);
    }

    public void delete(Long id){
        Profile savedProfile = profileRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Profile not found"));
        profileRepository.delete(savedProfile);
    }

    public List<Profile> list(){
        return profileRepository.findAll();
    }
}
