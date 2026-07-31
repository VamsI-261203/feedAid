package com.shareandcare.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.shareandcare.backend.config.MailConfig;

import jakarta.mail.internet.MimeMessage;

@Service
public class SmtpEmailProvider implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(SmtpEmailProvider.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private MailConfig mailConfig;

    @Override
    public void sendVerificationEmail(String to, String otp) {
        String subject = "Verify Your Email Address";
        String htmlBody = "<html><body>" +
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>" +
                "<h2 style='color: #28a745; text-align: center;'>Welcome to Feed-Aid!</h2>" +
                "<p>Hello,</p>" +
                "<p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address:</p>" +
                "<div style='background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px;'>" +
                otp +
                "</div>" +
                "<p style='color: #d9534f; font-size: 14px;'><strong>Note:</strong> This OTP will expire in 10 minutes.</p>" +
                "<p>If you did not request this verification, please ignore this email.</p>" +
                "<hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;' />" +
                "<p style='font-size: 12px; color: #777; text-align: center;'>&copy; " + java.time.Year.now().getValue() + " Feed-Aid. All rights reserved.</p>" +
                "</div>" +
                "</body></html>";

        sendHtmlEmail(to, subject, htmlBody);
    }

    @Override
    public void sendPasswordResetEmail(String to, String otp) {
        String subject = "Password Reset OTP";
        String htmlBody = "<html><body>" +
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>" +
                "<h2 style='color: #007bff; text-align: center;'>Password Reset Request</h2>" +
                "<p>Hello,</p>" +
                "<p>We received a request to reset the password for your Feed-Aid account. Use the following OTP to proceed:</p>" +
                "<div style='background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px;'>" +
                otp +
                "</div>" +
                "<p style='color: #d9534f; font-size: 14px;'><strong>Security Notice:</strong> This OTP will expire in 10 minutes. Do not share this code with anyone.</p>" +
                "<p>If you did not request a password reset, please secure your account immediately or contact support.</p>" +
                "<hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;' />" +
                "<p style='font-size: 12px; color: #777; text-align: center;'>&copy; " + java.time.Year.now().getValue() + " Feed-Aid. All rights reserved.</p>" +
                "</div>" +
                "</body></html>";

        sendHtmlEmail(to, subject, htmlBody);
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        String fromEmail = mailConfig.getSenderEmail();

        logger.info("===== EMAIL SEND START =====");
        logger.info("From: {}", fromEmail);
        logger.info("To: {}", to);
        logger.info("Subject: {}", subject);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            if (fromEmail != null && !fromEmail.isEmpty()) {
                helper.setFrom(fromEmail);
            }

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            logger.info("Email sent successfully to {}", to);
            logger.info("===== EMAIL SEND END =====");
        } catch (MailAuthenticationException e) {
            logger.error("SMTP Authentication failed", e);
            String cause = e.getCause() != null ? e.getCause().getMessage() : e.getMessage();
            throw new RuntimeException("Email authentication failed: " + cause, e);
        } catch (MailSendException e) {
            logger.error("SMTP Send failed", e);
            String cause = e.getCause() != null ? e.getCause().getMessage() : e.getMessage();
            throw new RuntimeException("Failed to send email: " + cause, e);
        } catch (Exception e) {
            logger.error("Email send failed", e);
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
}
