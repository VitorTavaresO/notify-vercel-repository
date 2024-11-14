package com.auction.backend.model;

import lombok.Data;

@Data
//@AllArgsConstructor
public class UserAuthResponseDTO {

    private String email;
    private String token;

    public UserAuthResponseDTO(String email, String token) {
        this.email = email;
        this.token = token;
    }
}
