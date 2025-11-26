package com.paypal.paymentsystem.repository;

import com.paypal.paymentsystem.model.Currency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CurrencyRepository extends JpaRepository<Currency, String> {
   
}
