package com.paypal.paymentsystem.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id") 
    private Long id;

    private String paypalUserId;

    private String fullName;

    private String email;

    private String passwordHash;
    
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}