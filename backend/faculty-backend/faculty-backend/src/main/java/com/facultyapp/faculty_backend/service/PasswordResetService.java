package com.facultyapp.faculty_backend.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.facultyapp.faculty_backend.entity.User;
import com.facultyapp.faculty_backend.repository.UserRepository;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    public PasswordResetService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    // ==========================
    // SEND RESET LINK
    // ==========================
    public void sendResetLink(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not registered"));

        // DO NOT CHECK FACULTY STATUS HERE ❌
        // Password reset is allowed for all users

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        String resetUrl = "http://localhost:5173/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Reset Your Password");
        message.setText(
                "Click the link below to reset your password:\n\n" +
                        resetUrl + "\n\nThis link expires in 15 minutes.");

        mailSender.send(message);
    }

    // ==========================
    // RESET PASSWORD
    // ==========================
    public void resetPassword(String token, String newPassword) {

        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);
    }
}
