package com.auction.backend.model.dto;

public class PasswordResetValidateDTO {
    private String email;
    private Integer validationCode;
    
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public Integer getValidationCode() {
        return validationCode;
    }
    public void setValidationCode(Integer validationCode) {
        this.validationCode = validationCode;
    }
}
