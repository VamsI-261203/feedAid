package com.shareandcare.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.shareandcare.backend.model.User;
import com.shareandcare.backend.repository.UserRepository;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpService otpService;

    /**
     * Atomic registration: saves user + generates OTP + sends email in a single transaction.
     * If email sending fails, the ENTIRE transaction is rolled back (user is NOT saved).
     */
    @Transactional(rollbackFor = Exception.class)
    public User registerUserWithVerification(User user) throws Exception {
        // Check if email already exists
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            User existing = existingUser.get();
            if (existing.isEmailVerified()) {
                throw new Exception("Email already registered!");
            } else {
                // User exists but never verified — delete stale record and allow re-registration
                otpService.deleteOtp(existing.getEmail(), "EMAIL_VERIFICATION");
                userRepository.delete(existing);
                userRepository.flush();
            }
        }

        // Hash password before saving
        String hashedPassword = org.mindrot.jbcrypt.BCrypt.hashpw(user.getPassword(), org.mindrot.jbcrypt.BCrypt.gensalt());
        user.setPassword(hashedPassword);
        user.setEmailVerified(false);

        // Save user (within transaction — not committed yet)
        User savedUser = userRepository.save(user);

        // Generate OTP, save OTP, send email — all in same transaction
        // If email send throws RuntimeException, entire TX rolls back (user + OTP deleted)
        otpService.generateAndSendOtp(savedUser.getId(), savedUser.getEmail(), "EMAIL_VERIFICATION");

        return savedUser;
    }

    /**
     * Simple registration without OTP (kept for backward compatibility).
     */
    public User registerUser(User user) throws Exception {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new Exception("Email already registered!");
        }

        // Hash password before saving
        String hashedPassword = org.mindrot.jbcrypt.BCrypt.hashpw(user.getPassword(), org.mindrot.jbcrypt.BCrypt.gensalt());
        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

    public User authenticateUser(String email, String password) throws Exception {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            if (!user.get().isEmailVerified()) {
                throw new Exception("Please verify your email before logging in.");
            }
            if (org.mindrot.jbcrypt.BCrypt.checkpw(password, user.get().getPassword())) {
                return user.get();
            }
        }
        throw new Exception("Invalid email or password");
    }

    public void updatePassword(String email, String newPassword) throws Exception {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String hashedPassword = org.mindrot.jbcrypt.BCrypt.hashpw(newPassword, org.mindrot.jbcrypt.BCrypt.gensalt());
            user.setPassword(hashedPassword);
            userRepository.save(user);
        } else {
            throw new Exception("User not found.");
        }
    }

    public void verifyEmail(String email) throws Exception {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setEmailVerified(true);
            userRepository.save(user);
        } else {
            throw new Exception("User not found.");
        }
    }
}
