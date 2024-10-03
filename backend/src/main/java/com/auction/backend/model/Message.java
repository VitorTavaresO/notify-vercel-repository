package com.auction.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "messages")
@Data
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "title", length = 100)
    private String title;

    @Column(nullable = false, name = "message")
    private String message;

    @Column(name = "link")
    private String link;

    @Column(nullable = false, name = "date")
    private LocalDateTime date;

    @Column(name = "URLImagem")
    private String URLImagem;

}
