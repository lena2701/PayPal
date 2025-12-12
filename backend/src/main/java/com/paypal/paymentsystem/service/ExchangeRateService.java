package com.paypal.paymentsystem.service;

import com.paypal.paymentsystem.dto.ExchangeRateResponseDTO;
import com.paypal.paymentsystem.model.ExchangeRate;
import com.paypal.paymentsystem.repository.ExchangeRateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class ExchangeRateService {

    private final ExchangeRateRepository exchangeRateRepository;

    public ExchangeRateResponseDTO getExchangeRate(String fromCurrency, String toCurrency) {
        if (fromCurrency == null || fromCurrency.isBlank() || toCurrency == null || toCurrency.isBlank()){
            throw new IllegalArgumentException("Währungscodes dürfen nicht leer sein");
        }
        ExchangeRate exRate = exchangeRateRepository.findByFromCurrencyAndToCurrency(fromCurrency, toCurrency)
        .orElseThrow(()-> new IllegalArgumentException("Wechselkurs wurde nicht gefunden"));

        return new ExchangeRateResponseDTO(exRate.getFromCurrency(), exRate.getToCurrency(), exRate.getRate());
        }

    public BigDecimal getRate(String fromCurrency, String toCurrency) {
        if (fromCurrency == null || fromCurrency.isBlank() || toCurrency == null || toCurrency.isBlank()){
            throw new IllegalArgumentException("Währungscodes dürfen nicht leer sein");
        }
        ExchangeRate exRate = exchangeRateRepository.findByFromCurrencyAndToCurrency(fromCurrency, toCurrency)
            .orElseThrow(() -> new IllegalArgumentException("Wechselkurs wurde nicht gefunden"));
        return exRate.getRate();
    }


    public void updateExchangeRate(String from, String to, double rate) {

        ExchangeRate ex = exchangeRateRepository
                .findByFromCurrencyAndToCurrency(from, to)
                .orElseGet(() -> {
                    ExchangeRate e = new ExchangeRate();
                    e.setFromCurrency(from);
                    e.setToCurrency(to);
                    return e;
                });

        ex.setRate(BigDecimal.valueOf(rate));
        ex.setLastUpdated(LocalDateTime.now());

        exchangeRateRepository.save(ex);
    }
}
