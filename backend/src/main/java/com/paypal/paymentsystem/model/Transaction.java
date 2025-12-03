package com.paypal.paymentsystem.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "transactions")

public class Transaction {
    @Id
    @Column(name = "transaction_id")
    private String transactionId;

    private Integer senderAccountId;
    
    private Integer receiverAccountId;

    @Column(name = "amount_sender")
    private BigDecimal amountSender;

    @Column(name = "amount_receiver")
    private BigDecimal amountReceiver;

    @Column(name = "sender_currency")
    private String senderCurrency;

    @Column(name = "receiver_currency")
    private String receiverCurrency;

    @Column(name = "exchange_rate")
    private BigDecimal exchangeRate;

    private BigDecimal fee;

    private String status;

    private String description;

    private String receiverName;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
