package com.paypal.paymentsystem.service;


import com.paypal.paymentsystem.dto.UserResponseDTO;
import com.paypal.paymentsystem.exception.UserNotFoundException;
import com.paypal.paymentsystem.model.User;
import com.paypal.paymentsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

     public User getUser(Long id){
        if (id == null){
            throw new UserNotFoundException("Die User-ID darf nicht null sein");
        }

        return userRepository.findById(id).orElseThrow(()-> new UserNotFoundException ("Der User wurde nicht gefunden"));
    }
     public User getUserByPaypalId(String userPaypalId){
        if (userPaypalId == null || userPaypalId.isBlank()){
            throw new UserNotFoundException("Die PayPal-ID darf nicht null oder leer sein");
        }
        return userRepository.findByPaypalUserId(userPaypalId).orElseThrow(()-> new UserNotFoundException ("Der User wurde nicht gefunden"));
    }

   public List<UserResponseDTO> searchUsersByName(String fullName) {
    if (fullName == null || fullName.isBlank()) {
        throw new IllegalArgumentException("Der Name darf nicht leer oder null sein");
    }

    List<User> users = userRepository.findByFullNameContainingIgnoreCase(fullName);
    List<UserResponseDTO> result = new ArrayList<>();
    for (User user : users) {
        result.add(new UserResponseDTO(
                user.getPaypalUserId(),
                user.getFullName(),
                user.getEmail()
        ));
    }

    return result; 
}
}

