package com.shareandcare.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.shareandcare.backend.model.User;
import com.shareandcare.backend.repository.UserRepository;
import com.shareandcare.backend.service.UserService;
import com.shareandcare.backend.service.OtpService;
import com.shareandcare.backend.service.EmailService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Regex for basic email validation
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    // Regex for strong password (min 8 chars, 1 upper, 1 lower, 1 number, 1 special char)
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");

    /**
     * Test endpoint to verify SMTP configuration works.
     * GET /api/auth/test-email?to=example@gmail.com
     */
    @GetMapping("/test-email")
    public ResponseEntity<?> testEmail(@RequestParam String to) {
        try {
            emailService.sendVerificationEmail(to, "123456");
            return ResponseEntity.ok(Map.of("message", "Test email sent successfully to " + to));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Register a new user with email OTP verification.
     * This is TRANSACTIONAL — if email sending fails, the user is NOT saved.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (user.getEmail() == null || !EMAIL_PATTERN.matcher(user.getEmail()).matches()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email format."));
        }
        if (user.getPassword() == null || !PASSWORD_PATTERN.matcher(user.getPassword()).matches()) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."));
        }

        try {
            // Atomic: saves user + generates OTP + sends email. Rolls back on failure.
            User savedUser = userService.registerUserWithVerification(user);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "User registered successfully. Please verify your email.",
                            "email", savedUser.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        try {
            boolean verified = otpService.verifyOtp(email, otp, "EMAIL_VERIFICATION");
            if (verified) {
                userService.verifyEmail(email);
                return ResponseEntity.ok(Map.of("message", "Email verified successfully. You can now login."));
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid OTP."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/resend-verification-otp")
    public ResponseEntity<?> resendVerificationOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email not registered."));
        }
        if (userOpt.get().isEmailVerified()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is already verified."));
        }
        try {
            otpService.generateAndSendOtp(userOpt.get().getId(), email, "EMAIL_VERIFICATION");
            return ResponseEntity.ok(Map.of("message", "A new OTP has been sent to your email."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        try {
            User user = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("user", user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No account found with this email."));
        }
        try {
            otpService.generateAndSendOtp(userOpt.get().getId(), email, "PASSWORD_RESET");
            return ResponseEntity.ok(Map.of("message", "Password reset OTP sent to your email."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify-reset-otp")
    public ResponseEntity<?> verifyResetOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        try {
            boolean verified = otpService.verifyOtp(email, otp, "PASSWORD_RESET");
            if (verified) {
                return ResponseEntity.ok(Map.of("message", "OTP verified. Proceed to reset password.", "token", otp));
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid OTP."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        if (newPassword == null || !PASSWORD_PATTERN.matcher(newPassword).matches()) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."));
        }

        try {
            boolean verified = otpService.verifyOtp(email, otp, "PASSWORD_RESET");
            if (verified) {
                userService.updatePassword(email, newPassword);
                otpService.deleteOtp(email, "PASSWORD_RESET");
                return ResponseEntity.ok(Map.of("message", "Password has been successfully reset."));
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid OTP."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
