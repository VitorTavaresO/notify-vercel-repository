package com.auction.backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
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

    @Column(nullable = false, name = "author")
    private String author;

    @ElementCollection
    @Column(nullable = true, name = "email", columnDefinition = "TEXT")
    private List<String> email = new ArrayList<>();  

    @ElementCollection
    @Column(nullable = true, name = "course", columnDefinition = "TEXT")
    private List<String> course = new ArrayList<>();  

    @ElementCollection
    @Column(nullable = true, name = "class_name", columnDefinition = "TEXT")
    private List<String> className = new ArrayList<>();  

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(nullable = false, name = "data")
    private LocalDateTime data;

    @Column(nullable = false, name = "mensage")
    private String message;

    @OneToMany(mappedBy = "message", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Annex> annexes = new ArrayList<>();

    @Transient
    private List<String> emailList;

    @Transient
    private List<String> courseList;

    @Transient
    private List<String> classNameList;

    public void addAnnex(Annex annex) {
        annexes.add(annex);
        annex.setMessage(this);
    }

    public void removeAnnex(Annex annex) {
        annexes.remove(annex);
        annex.setMessage(null);
    }
    @PrePersist
    protected void onCreateTimestamp() {
        this.data = LocalDateTime.now();
    }
}
