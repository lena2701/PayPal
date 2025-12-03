package com.paypal.paymentsystem.dto;

import java.math.BigDecimal;

import lombok.Getter;

@Getter
public class TransactionResponseDTO {

    private String senderAccountId;
    private String receiverAccountId;
    private BigDecimal amountSender;
    private BigDecimal amountReceiver;
    private String senderCurrency;
    private String receiverCurrency;
    private BigDecimal exchangeRate;
    private BigDecimal fee;
    private String status;
    private String message;
    private String receiverName;

    public TransactionResponseDTO (String senderAccountId, String receiverAccountId, BigDecimal amountSender,
        BigDecimal amountReceiver, String senderCurrency, String receiverCurrency, BigDecimal exchangeRate,
        BigDecimal fee, String status, String message, String receiverName) {
            this.senderAccountId = senderAccountId;
            this.receiverAccountId = receiverAccountId;
            this.amountSender = amountSender;
            this.amountReceiver = amountReceiver;
            this.senderCurrency = senderCurrency;
            this.receiverCurrency = receiverCurrency;
            this.exchangeRate = exchangeRate;
            this.fee = fee;
            this.status = status;
            this.message = message;
            this.receiverName = receiverName;
        }
   
    
}
