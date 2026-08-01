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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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

    @Override
    public void sendDeliveryConfirmationEmail(String donorEmail, String donorName,
            String receiverName, String itemName, int quantity,
            String foodType, LocalDateTime deliveredAt, Long claimId) {

        String subject = "\uD83C\uDF89 Donation Successfully Delivered — Feed Aid";

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
        String formattedDate = deliveredAt.format(formatter);

        String htmlBody = "<!DOCTYPE html>" +
                "<html><head><meta charset='UTF-8'></head><body style='margin:0; padding:0; background-color:#f4f4f4;'>" +
                "<table width='100%' cellpadding='0' cellspacing='0' style='background-color:#f4f4f4; padding: 40px 0;'>" +
                "<tr><td align='center'>" +
                "<table width='600' cellpadding='0' cellspacing='0' style='background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);'>" +

                // Header
                "<tr><td style='background: linear-gradient(135deg, #f27221 0%, #e03a55 100%); padding: 30px 40px; text-align: center;'>" +
                "<h1 style='margin:0; color:#ffffff; font-family: Arial, sans-serif; font-size: 28px; font-weight: 700;'>\uD83C\uDF72 Feed Aid</h1>" +
                "<p style='margin:8px 0 0 0; color:rgba(255,255,255,0.9); font-family: Arial, sans-serif; font-size: 14px;'>Reducing Food Waste, Feeding People</p>" +
                "</td></tr>" +

                // Green success banner
                "<tr><td style='background-color:#28a745; padding: 16px 40px; text-align: center;'>" +
                "<p style='margin:0; color:#ffffff; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600;'>✅ Donation Successfully Delivered!</p>" +
                "</td></tr>" +

                // Body
                "<tr><td style='padding: 35px 40px;'>" +
                "<p style='margin:0 0 20px 0; font-family: Arial, sans-serif; font-size: 16px; color:#333; line-height: 1.6;'>" +
                "Hello <strong>" + escapeHtml(donorName) + "</strong>,</p>" +
                "<p style='margin:0 0 25px 0; font-family: Arial, sans-serif; font-size: 16px; color:#333; line-height: 1.6;'>" +
                "Great news! Your donation has been <strong>successfully received</strong> by the person in need. " +
                "Here are the details:</p>" +

                // Details table
                "<table width='100%' cellpadding='0' cellspacing='0' style='background-color:#f8f9fa; border-radius:8px; border: 1px solid #e9ecef; margin: 0 0 25px 0;'>" +
                "<tr><td style='padding: 20px 25px;'>" +
                "<table width='100%' cellpadding='0' cellspacing='0'>" +

                detailRow("\uD83D\uDC64 Receiver", escapeHtml(receiverName)) +
                detailRow("\uD83C\uDF5C Food Items", escapeHtml(itemName != null ? itemName : "Donated Food")) +
                detailRow("\uD83C\uDF7D Food Type", escapeHtml(foodType != null ? foodType : "N/A")) +
                detailRow("\uD83D\uDCE6 Quantity", quantity + " pack" + (quantity > 1 ? "s" : "")) +
                detailRow("\uD83D\uDCC5 Received On", formattedDate) +
                detailRow("\uD83C\uDD94 Donation ID", "#" + claimId) +

                "</table>" +
                "</td></tr></table>" +

                // Thank you message
                "<div style='background-color:#fff3e0; border-left: 4px solid #f27221; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 0 0 25px 0;'>" +
                "<p style='margin:0; font-family: Arial, sans-serif; font-size: 15px; color:#e65100; line-height: 1.6;'>" +
                "\uD83D\uDC9A <strong>Thank you</strong> for helping Feed Aid reduce food waste and support people in need. " +
                "Your contribution has made a real difference!</p>" +
                "</div>" +

                "<p style='margin:0; font-family: Arial, sans-serif; font-size: 15px; color:#666; line-height: 1.6;'>" +
                "Warm regards,<br><strong style='color:#f27221;'>The Feed Aid Team</strong></p>" +
                "</td></tr>" +

                // Footer
                "<tr><td style='background-color:#f8f9fa; padding: 20px 40px; text-align: center; border-top: 1px solid #e9ecef;'>" +
                "<p style='margin:0; font-family: Arial, sans-serif; font-size: 12px; color:#999;'>" +
                "&copy; " + java.time.Year.now().getValue() + " Feed-Aid. All rights reserved.</p>" +
                "<p style='margin:5px 0 0 0; font-family: Arial, sans-serif; font-size: 11px; color:#bbb;'>" +
                "This is an automated notification. Please do not reply to this email.</p>" +
                "</td></tr>" +

                "</table></td></tr></table></body></html>";

        sendHtmlEmail(donorEmail, subject, htmlBody);
    }

    /**
     * Helper to generate a single row in the delivery details table.
     */
    private String detailRow(String label, String value) {
        return "<tr>" +
                "<td style='padding: 8px 0; font-family: Arial, sans-serif; font-size: 14px; color:#888; width: 140px; vertical-align: top;'>" + label + "</td>" +
                "<td style='padding: 8px 0; font-family: Arial, sans-serif; font-size: 14px; color:#333; font-weight: 600;'>" + value + "</td>" +
                "</tr>";
    }

    /**
     * Simple HTML escaping to prevent injection in email templates.
     */
    private String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                     .replace("<", "&lt;")
                     .replace(">", "&gt;")
                     .replace("\"", "&quot;")
                     .replace("'", "&#39;");
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        String fromEmail = mailConfig.getSenderEmail();

        logger.info("===== EMAIL SEND START =====");
        logger.info("From: {}", fromEmail);
        logger.info("To: {}", to);
        logger.info("Subject: {}", subject);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

            if (fromEmail != null && !fromEmail.isEmpty()) {
                helper.setFrom(fromEmail, "Feed-Aid");
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
