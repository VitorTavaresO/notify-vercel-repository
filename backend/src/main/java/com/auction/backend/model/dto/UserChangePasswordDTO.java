package com.auction.backend.model.dto;

import lombok.Data;

@Data
public class UserChangePasswordDTO {
    
    private String email;
    private String password;

    public UserChangePasswordDTO(String email, String newPassword) {

        this.email = email;
        this.password = newPassword;
    }
}