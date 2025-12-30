package com.facultyapp.faculty_backend.controller;

import com.facultyapp.faculty_backend.dto.LoginRequest;
import com.facultyapp.faculty_backend.dto.LoginResponse;
import com.facultyapp.faculty_backend.dto.UserProfileResponse;
import com.facultyapp.faculty_backend.service.AuthService;
import com.facultyapp.faculty_backend.service.PasswordResetService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    public AuthController(
            AuthService authService,
            PasswordResetService passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    // ================= CURRENT USER PROFILE =================
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            Authentication authentication) {

        String email = authentication.getName();
        return ResponseEntity.ok(authService.getMyProfile(email));
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // ================= FORGOT PASSWORD =================
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> body) {

        try {
            String email = body.get("email");

            if (email == null || email.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Email is required"));
            }

            passwordResetService.sendResetLink(email);

            return ResponseEntity.ok(
                    Map.of("message", "Reset link sent to email"));

        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", ex.getMessage()));
        }
    }

    // ================= RESET PASSWORD =================
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody Map<String, String> body) {

        String token = body.get("token");
        String newPassword = body.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid request"));
        }

        passwordResetService.resetPassword(token, newPassword);

        return ResponseEntity.ok(
                Map.of("message", "Password reset successful"));
    }

    @PostMapping("/profile-photo")
    public ResponseEntity<?> uploadProfilePhoto(
            Authentication authentication,
            @RequestParam MultipartFile file) {

        authService.updateProfilePhoto(authentication.getName(), file);
        return ResponseEntity.ok().build();
    }

}
