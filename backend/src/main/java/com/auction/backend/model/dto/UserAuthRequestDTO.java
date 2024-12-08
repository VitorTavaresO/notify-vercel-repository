package com.auction.backend.model.dto;

import lombok.Data;

@Data
public class UserAuthRequestDTO {
    private String siape;
    private String password;
}
