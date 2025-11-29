package com.paypal.paymentsystem.dto;

import java.math.BigDecimal;

import lombok.Getter;

@Getter
public class ExchangeRateResponseDTO {   
    private String fromCurrency;
    private String toCurrency;
    private BigDecimal rate;

    public ExchangeRateResponseDTO (String fromCurrency, String toCurrency, BigDecimal rate){
            this.fromCurrency = fromCurrency;
            this.toCurrency = toCurrency;
            this.rate = rate;
        }

    }