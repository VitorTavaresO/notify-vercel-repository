package com.auction.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "guardian")
@Data
public class Guardian {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String phone;
    private String email;
    private String studentName;
    
    @Column(name = "student_ra", columnDefinition = "CHAR(11)")
    private String studentRA;

    private String status;
    private String course;
    private String courseYear;
}
