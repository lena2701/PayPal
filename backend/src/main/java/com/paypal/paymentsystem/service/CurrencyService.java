package com.paypal.paymentsystem.service;


import com.paypal.paymentsystem.exception.CurrencyNotFoundException;
import com.paypal.paymentsystem.model.Currency;
import com.paypal.paymentsystem.repository.CurrencyRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrencyService {

    private final CurrencyRepository currencyRepository;

    public Currency getCurrency(String code){
        if (code == null || code.isBlank()){
            throw new CurrencyNotFoundException("Währungscode darf nicht null oder leer sein");
        }

        return currencyRepository.findById(code).orElseThrow(()-> new CurrencyNotFoundException ("Währung wurde nicht gefunden"));
    }
}
