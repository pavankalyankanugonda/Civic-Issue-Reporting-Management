package com.civicreporting.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    private final Map<String, String> otpStorage = new HashMap<>();
    private final Random random = new Random();

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.otp.enable-email:false}")
    private boolean enableEmail;

    @Value("${app.otp.show-in-response:true}")
    private boolean showInResponse;

    public Map<String, Object> generateOtp(String email) {
        String otp = String.format("%06d", random.nextInt(1000000));
        otpStorage.put(email, otp);

        System.out.println("\n[OTP SERVICE] >>> Generating OTP for: " + email);
        System.out.println("[OTP SERVICE] >>> OTP Value: " + otp);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "OTP generated successfully");

        // For development/testing - show OTP in response
        if (showInResponse) {
            response.put("otp", otp);
            response.put("note", "Development mode: OTP included in response");
        }

        // Try to send email if enabled
        if (enableEmail) {
            if (mailSender == null) {
                System.err.println("[OTP SERVICE] ERROR: Email enabled but JavaMailSender is not configured!");
            } else {
                try {
                    sendOtpEmail(email, otp);
                } catch (Exception e) {
                    System.err.println("[OTP SERVICE] ERROR: Failed to send email: " + e.getMessage());
                }
            }
        }

        return response;
    }

    private void sendOtpEmail(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Civic Reporting - Verification Code");
        message.setText("Your verification code is: " + otp + "\n\nUse this code to complete your registration.");
        message.setFrom("noreply@civicreporting.com");
        mailSender.send(message);
        System.out.println("[OTP SERVICE] Email sent successfully to: " + email);
    }

    public boolean verifyOtp(String email, String otp) {
        String storedOtp = otpStorage.get(email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(email);
            return true;
        }
        return false;
    }
}