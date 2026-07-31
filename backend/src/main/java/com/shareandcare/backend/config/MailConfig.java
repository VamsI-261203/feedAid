package com.shareandcare.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * Manual mail configuration that reads credentials from .env file.
 * This replaces the broken spring-dotenv integration with Spring Boot 4.1.0.
 * Credentials are NEVER hardcoded in source code.
 */
@Configuration
public class MailConfig {

    private final Map<String, String> envVars;

    public MailConfig() {
        this.envVars = loadEnvFile();
    }

    private Map<String, String> loadEnvFile() {
        Map<String, String> vars = new HashMap<>();
        File envFile = new File(".env");

        System.out.println("\n===== LOADING .env FILE =====");
        System.out.println("Looking for .env at: " + envFile.getAbsolutePath());

        if (!envFile.exists()) {
            System.err.println("WARNING: .env file NOT FOUND!");
            System.err.println("Create a .env file in the backend/ directory with:");
            System.err.println("MAIL_USERNAME=your-email@gmail.com");
            System.err.println("MAIL_PASSWORD=your-16-char-app-password");
            System.err.println("=============================\n");
            return vars;
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) continue;
                int equalsIndex = line.indexOf('=');
                if (equalsIndex > 0) {
                    String key = line.substring(0, equalsIndex).trim();
                    String value = line.substring(equalsIndex + 1).trim();
                    // Remove surrounding quotes if present
                    if ((value.startsWith("\"") && value.endsWith("\"")) ||
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.substring(1, value.length() - 1);
                    }
                    vars.put(key, value);
                }
            }
            System.out.println(".env file loaded successfully!");
        } catch (IOException e) {
            System.err.println("ERROR reading .env file: " + e.getMessage());
        }

        System.out.println("MAIL_USERNAME: " + vars.getOrDefault("MAIL_USERNAME", "NOT SET"));
        System.out.println("MAIL_PASSWORD: " + (vars.containsKey("MAIL_PASSWORD") ? "***LOADED (" + vars.get("MAIL_PASSWORD").length() + " chars)***" : "NOT SET"));
        System.out.println("=============================\n");

        return vars;
    }

    @Bean
    public JavaMailSender javaMailSender() {
        String username = envVars.getOrDefault("MAIL_USERNAME", "");
        String password = envVars.getOrDefault("MAIL_PASSWORD", "");

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");
        props.put("mail.smtp.connectiontimeout", "5000");
        props.put("mail.smtp.timeout", "5000");
        props.put("mail.smtp.writetimeout", "5000");

        return mailSender;
    }

    /**
     * Returns the sender email address loaded from the .env file.
     */
    public String getSenderEmail() {
        return envVars.getOrDefault("MAIL_USERNAME", "");
    }
}
