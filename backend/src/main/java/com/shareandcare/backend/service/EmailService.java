package com.shareandcare.backend.service;

import java.time.LocalDateTime;

public interface EmailService {
    void sendVerificationEmail(String to, String otp);
    void sendPasswordResetEmail(String to, String otp);
    void sendDeliveryConfirmationEmail(String donorEmail, String donorName,
            String receiverName, String itemName, int quantity,
            String foodType, LocalDateTime deliveredAt, Long claimId);
}
