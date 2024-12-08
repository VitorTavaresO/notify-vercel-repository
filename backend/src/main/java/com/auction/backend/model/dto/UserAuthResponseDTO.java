package com.auction.backend.model.dto;

public class UserAuthResponseDTO {
    private String siape;
    private String token;
    private String role;

    public UserAuthResponseDTO(String siape, String token, String role) {
        this.siape = siape;
        this.token = token;
        this.role = role;
    }

    // Getters and setters
    public String getSiape() {
        return siape;
    }

    public void setSiape(String siape) {
        this.siape = siape;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
