package com.paypal.paymentsystem.dto;

import java.math.BigDecimal;

public class TransactionRequestDTO {
    private String senderPaypalId;
    private String receiverPaypalId;
    private BigDecimal amount;
    private String senderCurrencyCode;
    private String receiverCurrencyCode;
    private String description;

    public String getSenderPaypalId(){
        return senderPaypalId;
    }

    public String getReceiverPaypalId (){
        return receiverPaypalId;
    }

    public BigDecimal getAmount (){
        return amount;
    }

    public String getSenderCurrencyCode(){
        return senderCurrencyCode;
    }

    public String getReceiverCurrencyCode() {
        return receiverCurrencyCode;
    }

    public String getDescription(){
        return description;
    }

}
