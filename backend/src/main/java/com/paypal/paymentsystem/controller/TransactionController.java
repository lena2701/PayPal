package com.paypal.paymentsystem.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paypal.paymentsystem.dto.TransactionRequestDTO;
import com.paypal.paymentsystem.dto.TransactionResponseDTO;
import com.paypal.paymentsystem.model.Transaction;
import com.paypal.paymentsystem.service.TransactionService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public TransactionResponseDTO createTransaction (@RequestBody TransactionRequestDTO request) {
        Transaction transac = transactionService.processTransaction(request.getSenderPaypalId(), request.getReceiverPaypalId(),
        request.getAmount(), request.getDescription(), request.getSenderCurrencyCode(), request.getReceiverCurrencyCode());
        
        return new TransactionResponseDTO(
            String.valueOf(transac.getSenderAccountId()),
            String.valueOf(transac.getReceiverAccountId()),
            transac.getAmountSender(),
            transac.getAmountReceiver(),
            transac.getSenderCurrency(),
            transac.getReceiverCurrency(),
            transac.getExchangeRate(),
            transac.getFee(),
            transac.getStatus(),
            transac.getDescription(),
            transac.getReceiverName()
    );
    }
    

}
    
