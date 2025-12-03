package com.paypal.paymentsystem.repository;

import com.paypal.paymentsystem.model.Transaction;
import com.paypal.paymentsystem.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    List<Transaction> findBySenderAccountId(Integer senderAccountId);
    List<Transaction> findByReceiverAccountId(Account receiverAccountId);
    List<Transaction> findByStatus(String status);


}
