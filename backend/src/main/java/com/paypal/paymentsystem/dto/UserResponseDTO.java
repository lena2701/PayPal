package com.paypal.paymentsystem.dto;

import lombok.Getter;

@Getter
public class UserResponseDTO {
    private String paypalUserId;
    private String fullName;
    private String email;
    private String initials;
  

    public UserResponseDTO (String paypalUserId, String fullName, String email) {

        this.paypalUserId = paypalUserId;
        this.fullName = fullName;
        this.email = email;
        this.initials = generateInitials(fullName);
    }

        public String generateInitials(String name) {
         if (name == null || name.isEmpty()) {
             return "";
         }
         String[] parts = name.split("\\s+");
         StringBuilder initialsBuilder = new StringBuilder();
         for (String part : parts) {
             initialsBuilder.append(Character.toUpperCase(part.charAt(0)));
    }
            return initialsBuilder.toString();
        
    }
}
