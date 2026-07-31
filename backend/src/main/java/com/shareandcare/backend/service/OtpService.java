package com.shareandcare.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.shareandcare.backend.model.OtpEntity;
import com.shareandcare.backend.repository.OtpRepository;
import org.mindrot.jbcrypt.BCrypt;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;
    
    @Autowired
    private EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();
    private static final int MAX_ATTEMPTS = 5;
    private static final int OTP_EXPIRY_MINUTES = 10;

    @Transactional
    public void generateAndSendOtp(Long userId, String email, String purpose) throws Exception {
        // Rate limiting and resend logic
        Optional<OtpEntity> existingOtp = otpRepository.findByEmailAndPurpose(email, purpose);
        int currentResendCount = 0;
        
        if (existingOtp.isPresent()) {
            OtpEntity otp = existingOtp.get();
            if (otp.getCreatedAt().plusSeconds(60).isAfter(LocalDateTime.now())) {
                throw new Exception("Please wait 60 seconds before requesting a new OTP.");
            }
            if (otp.getResendCount() >= 3) {
                throw new Exception("Maximum resend attempts reached. Please try again later.");
            }
            currentResendCount = otp.getResendCount() + 1;
            otpRepository.delete(otp);
        }

        // Generate 6 digit OTP
        int number = secureRandom.nextInt(900000) + 100000; // ensures 6 digits
        String otpValue = String.valueOf(number);
        
        // Hash the OTP
        String hashedOtp = BCrypt.hashpw(otpValue, BCrypt.gensalt());

        OtpEntity newOtp = new OtpEntity(userId, email, hashedOtp, purpose, LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        newOtp.setResendCount(currentResendCount);
        otpRepository.save(newOtp);

        // Send Email via Antigravity Email Service
        if (purpose.equals("EMAIL_VERIFICATION")) {
            emailService.sendVerificationEmail(email, otpValue);
        } else if (purpose.equals("PASSWORD_RESET")) {
            emailService.sendPasswordResetEmail(email, otpValue);
        }
    }

    @Transactional
    public boolean verifyOtp(String email, String otpValue, String purpose) throws Exception {
        Optional<OtpEntity> otpOpt = otpRepository.findByEmailAndPurpose(email, purpose);
        
        if (!otpOpt.isPresent()) {
            throw new Exception("No active OTP found. Please request a new one.");
        }
        
        OtpEntity otpEntity = otpOpt.get();
        
        if (otpEntity.getAttempts() >= MAX_ATTEMPTS) {
            otpRepository.delete(otpEntity);
            throw new Exception("Maximum verification attempts reached. Please request a new OTP.");
        }
        
        if (otpEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
            otpRepository.delete(otpEntity);
            throw new Exception("OTP has expired. Please request a new one.");
        }
        
        if (BCrypt.checkpw(otpValue, otpEntity.getOtpHash())) {
            if (purpose.equals("EMAIL_VERIFICATION")) {
                otpRepository.delete(otpEntity);
            }
            return true; // Success
        } else {
            otpEntity.incrementAttempts();
            otpRepository.save(otpEntity);
            throw new Exception("Invalid OTP. Attempts remaining: " + (MAX_ATTEMPTS - otpEntity.getAttempts()));
        }
    }
    
    @Transactional
    public void deleteOtp(String email, String purpose) {
        otpRepository.deleteByEmailAndPurpose(email, purpose);
    }
}
