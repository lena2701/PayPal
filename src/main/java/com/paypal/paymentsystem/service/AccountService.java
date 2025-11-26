package com.paypal.paymentsystem.service;

import com.paypal.paymentsystem.exception.AccountNotFoundException;
import com.paypal.paymentsystem.model.Account;
import com.paypal.paymentsystem.model.Currency;
import com.paypal.paymentsystem.model.User;
import com.paypal.paymentsystem.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    public Account getAccount(Long id) {
        if(id == null) {
            throw new AccountNotFoundException("Die Account-ID darf nicht null sein");
        }
        return accountRepository.findById(id).orElseThrow(()-> new AccountNotFoundException("Der Account wurde nicht gefunden"));
    }

    public Account getAccountByUserAndCurrency(User user, Currency currency) {
       if(user == null || currency == null){
        throw new AccountNotFoundException("Der Benutzer und die Währung dürfen nicht null sein");
       }
       return accountRepository.findByUserAndCurrency(user, currency).orElseThrow(()-> new AccountNotFoundException("Der Account mit dieser Währung wurde von diesem Benutzer nicht gefunden"));
    }

}
