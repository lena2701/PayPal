package com.paypal.paymentsystem.dto;

import lombok.Getter;

@Getter
public class UserResponseDTO {
    private String paypalUserId;
    private String fullName;
    private String email;
  

    public UserResponseDTO (String paypalUserId, String fullName, String email ){

        this.paypalUserId = paypalUserId;
        this.fullName = fullName;
        this.email = email;
    }
}
