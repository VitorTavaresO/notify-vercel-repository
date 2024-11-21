package com.auction.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.auction.backend.model.UserAuthRequestDTO;
import com.auction.backend.model.UserAuthResponseDTO;
import com.auction.backend.security.JwtService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public UserAuthResponseDTO authenticateUser(@RequestBody UserAuthRequestDTO authRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    authRequest.getSiape(), authRequest.getPassword())
        );
        
        return new UserAuthResponseDTO(
            authRequest.getSiape(), 
            jwtService.generateToken(authentication.getName())
        );
    }
}
