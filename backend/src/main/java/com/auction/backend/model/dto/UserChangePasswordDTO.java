package com.auction.backend.model.dto;

import lombok.Data;

@Data
public class UserChangePasswordDTO {
    
    private String email;
    private String password;

    public UserChangePasswordDTO(String email, String password) {

        this.email = email;
        this.password = password;
    }
}