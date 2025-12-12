package com.paypal.paymentsystem.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExchangeRateUpdateService {

    private final ExchangeRateService exchangeRateService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Scheduled(fixedRate = 12 * 60 * 60 * 1000)
    public void updateRates() {

        String url = "https://api.frankfurter.app/latest?from=EUR&to=USD,GBP,JPY";

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            Map<String, Double> rates = (Map<String, Double>) response.get("rates");

            System.out.println("Wechselkurse werden aktualisiert...");

            for (Map.Entry<String, Double> entry : rates.entrySet()) {
                String to = entry.getKey();
                double rate = entry.getValue();

                exchangeRateService.updateExchangeRate("EUR", to, rate);

                exchangeRateService.updateExchangeRate(to, "EUR", 1.0 / rate);
            }

            System.out.println("Wechselkurse erfolgreich aktualisiert");

        } catch (Exception e) {
            System.err.println("Fehler beim Laden der Wechselkurse: " + e.getMessage());
        }
    }
}