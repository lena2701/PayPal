package com.paypal.paymentsystem.service;

import com.paypal.paymentsystem.exception.UserNotFoundException;
import com.paypal.paymentsystem.model.Account;
import com.paypal.paymentsystem.model.Currency;
import com.paypal.paymentsystem.model.Transaction;


import com.paypal.paymentsystem.model.User;
import com.paypal.paymentsystem.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository; //eventuell entfernen wenn nicht benötigt 
    private final UserService userService;  
    private final AccountService accountService;
    private final CurrencyService currencyService;
    private final ExchangeRateService exchangeRateService;
    private final DataSource dataSource;

    public Transaction processTransaction(String senderPayPalId, String receiverPayPalId, BigDecimal amount, String description, String senderCurrencyCode, String receiverCurrencyCode){
        if (senderPayPalId == null || senderPayPalId.isBlank()){
            throw new UserNotFoundException("Die Sender PayPal-ID darf nicht null oder leer sein");
        } 
         if (receiverPayPalId == null || receiverPayPalId.isBlank()){
            throw new UserNotFoundException("Die Empfänger PayPal-ID darf nicht null oder leer sein");
        } 
        if(amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Der Betrag muss größer als 0 sein");
        }
        if(senderPayPalId.equals(receiverPayPalId)){
            throw new IllegalArgumentException("Sender und Empfänger müssen unterschiedlich sein");
        }
        if (senderCurrencyCode == null || senderCurrencyCode.isBlank()) {
            throw new IllegalArgumentException("Sender-Währung darf nicht leer sein");
        }
        if (receiverCurrencyCode == null || receiverCurrencyCode.isBlank()) {
            throw new IllegalArgumentException("Empfänger-Währung darf nicht leer sein");
        }
        

        User sender = userService.getUserByPaypalId(senderPayPalId);
        User receiver = userService.getUserByPaypalId(receiverPayPalId);

        Currency senderCurrency = currencyService.getCurrency(senderCurrencyCode);
        Currency receiverCurrency = currencyService.getCurrency(receiverCurrencyCode);

        Account senderAcc = accountService.getAccountByUserAndCurrency(sender, senderCurrency);
        Account receiverAcc = accountService.getAccountByUserAndCurrency(receiver, receiverCurrency);

        BigDecimal exchangeRate = exchangeRateService.getRate(senderCurrency.getCode(), receiverCurrency.getCode());
        BigDecimal amountReceiver = amount.multiply(exchangeRate);

        String transactionId = null;
        String status = null;
        String message = null;

    try (Connection connection = dataSource.getConnection();
     CallableStatement call = connection.prepareCall("{ CALL ProccessTransaction(?, ?, ?, ?, ?, ?, ?) }")) {

    call.setString(1, senderPayPalId);
    call.setString(2, receiverPayPalId);
    call.setBigDecimal(3, amount);
    call.setString(4, description);

    call.registerOutParameter(5, Types.VARCHAR);
    call.registerOutParameter(6, Types.VARCHAR);
    call.registerOutParameter(7, Types.VARCHAR);

    call.execute();

    transactionId = call.getString(5);
    status = call.getString(6);
    message = call.getString(7);

} catch (Exception e) {
    throw new RuntimeException("Fehler beim Aufrufen der Stored Procedure", e);
}
Transaction result = new Transaction();

result.setTransactionId(transactionId); 

result.setSenderAccount(senderAcc);
result.setReceiverAccount(receiverAcc);

result.setAmountSender(amount);         
result.setAmountReceiver(amountReceiver);      

result.setSenderCurrency(senderCurrency.getCode());
result.setReceiverCurrency(receiverCurrency.getCode());
result.setExchangeRate(exchangeRate);

result.setStatus(status);
result.setDescription(message);

result.setCreatedAt(LocalDateTime.now());
result.setUpdatedAt(LocalDateTime.now());

return result;
    }
}
