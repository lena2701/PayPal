package com.paypal.paymentsystem.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paypal.paymentsystem.dto.UserResponseDTO;
import com.paypal.paymentsystem.model.User;
import com.paypal.paymentsystem.service.UserService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{paypalUserId}")
    public UserResponseDTO getUserByPaypalId(@PathVariable String paypalUserId) {
        User user = userService.getUserByPaypalId(paypalUserId);
        return new UserResponseDTO(user.getPaypalUserId(), user.getFullName(), user.getEmail());
    }
    
   @GetMapping("/search")
    public List<UserResponseDTO> searchUsers(@RequestParam String name) {
        return userService.searchUsersByName(name);
    }
  }
    

