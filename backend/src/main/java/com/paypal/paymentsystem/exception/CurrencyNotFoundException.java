package com.paypal.paymentsystem.exception;

public class CurrencyNotFoundException extends RuntimeException{
    public CurrencyNotFoundException(String message) {
        super(message);
    }
}
