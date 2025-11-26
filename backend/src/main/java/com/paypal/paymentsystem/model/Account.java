package com.paypal.paymentsystem.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@Entity
@Table(name = "accounts")

public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "currency_code", nullable = false)
    private Currency currency;

    private BigDecimal cachedBalance;

    private String accountStatus;

    private LocalDateTime createdAt;

}
