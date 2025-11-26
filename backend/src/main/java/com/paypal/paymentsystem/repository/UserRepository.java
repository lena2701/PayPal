package com.paypal.paymentsystem.repository;

import com.paypal.paymentsystem.model.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;




@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPaypalUserId(String paypalUserId);
    Optional<User> findByEmail(String email);
    List<User> findByFullNameContainingIgnoreCase(String fullName);
}