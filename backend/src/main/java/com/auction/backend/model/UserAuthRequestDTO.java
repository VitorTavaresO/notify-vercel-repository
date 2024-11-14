package com.auction.backend.model;

import lombok.Data;

@Data
public class UserAuthRequestDTO {
    private String email;
    private String password;
}
