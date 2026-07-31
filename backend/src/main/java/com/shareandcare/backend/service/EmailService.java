package com.shareandcare.backend.service;

public interface EmailService {
    void sendVerificationEmail(String to, String otp);
    void sendPasswordResetEmail(String to, String otp);
}
