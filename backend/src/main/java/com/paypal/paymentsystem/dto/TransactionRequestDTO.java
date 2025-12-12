package com.paypal.paymentsystem.dto;

import lombok.Getter;
import java.math.BigDecimal;

@Getter
public class TransactionRequestDTO {
    private String senderPaypalId;
    private String receiverPaypalId;
    private BigDecimal amount;
    private String senderCurrencyCode;
    private String receiverCurrencyCode;
    private String description;
}
