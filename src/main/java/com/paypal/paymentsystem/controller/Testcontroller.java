package com.paypal.paymentsystem.controller;

import com.paypal.paymentsystem.model.User;
import com.paypal.paymentsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class Testcontroller {
        private final UserRepository userRepository;

  
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
