package com.auction.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auction.backend.model.Profile;
import com.auction.backend.service.ProfileService;

@RestController
@RequestMapping("api/profile")
public class ProfileController {
    
    @Autowired
    private ProfileService profileService;

    @PostMapping
    public Profile create(@RequestBody Profile profile){
        return profileService.create(profile);
    }

    @GetMapping("/{id}")
    public Profile read(@PathVariable("id") Long id){
        return profileService.read(id);
    }

    @PutMapping
    public Profile update(@RequestBody Profile profile){
        return profileService.update(profile);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id){
        profileService.delete(id);
    }

    @GetMapping
    public List<Profile> list(){
        return profileService.list();
    }
    

    
}
