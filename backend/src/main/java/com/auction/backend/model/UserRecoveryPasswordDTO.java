package com.auction.backend.model;


import lombok.Data;

@Data
public class UserRecoveryPasswordDTO {
    private String email;
    private String validationCode;
    private String newPassword;

    public UserRecoveryPasswordDTO(String email, String validationCode, String newPassword) {
        this.email = email;
        this.validationCode = validationCode;
        this.newPassword = newPassword;
    }
}
