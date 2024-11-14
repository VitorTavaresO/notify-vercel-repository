package com.auction.backend.model;

import lombok.Data;

@Data
public class UserAuthRequestDTO {
    private String siape;
    private String password;
}
