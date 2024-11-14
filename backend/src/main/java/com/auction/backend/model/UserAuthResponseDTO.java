package com.auction.backend.model;

import lombok.Data;

@Data
//@AllArgsConstructor
public class UserAuthResponseDTO {

    private String siape;
    private String token;

    public UserAuthResponseDTO(String siape, String token) {
        this.siape = siape;
        this.token = token;
    }
}
