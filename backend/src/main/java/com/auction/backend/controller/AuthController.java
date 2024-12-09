package com.auction.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.auction.backend.model.dto.UserAuthRequestDTO;
import com.auction.backend.model.dto.UserAuthResponseDTO;
import com.auction.backend.repository.UserRepository;
import com.auction.backend.security.JwtService;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public UserAuthResponseDTO authenticateUser(@RequestBody UserAuthRequestDTO authRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    authRequest.getSiape(), authRequest.getPassword())
        );
        String role = userRepository.findBySiape(authRequest.getSiape())
                                    .orElseThrow(NoSuchElementException::new)
                                    .getRoleName().toString();
        return new UserAuthResponseDTO(
            authRequest.getSiape(), 
            jwtService.generateToken(authentication.getName()),
            role
        );
    }
}
