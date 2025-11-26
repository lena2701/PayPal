package com.paypal.paymentsystem.repository;

import com.paypal.paymentsystem.model.Account;
import com.paypal.paymentsystem.model.User;
import com.paypal.paymentsystem.model.Currency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;


@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUser(User user);
    Optional<Account> findByUserAndCurrency (User user, Currency currency);
    List<Account> findByAccountStatus(String accountStatus);
}
