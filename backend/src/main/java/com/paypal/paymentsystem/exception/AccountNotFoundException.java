package com.paypal.paymentsystem.exception;

public class AccountNotFoundException extends RuntimeException {
      public AccountNotFoundException(String message) {
        super(message);
    }
}
