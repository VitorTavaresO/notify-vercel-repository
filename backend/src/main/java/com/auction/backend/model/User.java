package com.auction.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "user")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "{name.required}")
    private String name;

    @NotBlank(message = "{cpf.required}")
    private String cpf;

    @NotBlank(message = "{siape.required}")
    private String siape;

    @NotBlank(message = "{position.required}")
    private String position;

    @Email(message = "{email.invalid}")
    private String email;

    @NotBlank(message = "{name.required}")
    private String phone;

    @NotBlank(message = "{name.required}")
    private String password;
}
