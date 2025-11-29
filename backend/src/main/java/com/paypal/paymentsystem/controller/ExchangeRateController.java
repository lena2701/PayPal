package com.paypal.paymentsystem.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paypal.paymentsystem.dto.ExchangeRateResponseDTO;
import com.paypal.paymentsystem.service.ExchangeRateService;

import lombok.RequiredArgsConstructor;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ExchangeRateController {
    private final ExchangeRateService exchangeRateService;

    @GetMapping("/exchange-rate")
    public ExchangeRateResponseDTO getExchangeRate(@RequestParam String fromCurrency, @RequestParam String toCurrency ) {
        return exchangeRateService.getExchangeRate(fromCurrency, toCurrency);
    
    }
    
}
