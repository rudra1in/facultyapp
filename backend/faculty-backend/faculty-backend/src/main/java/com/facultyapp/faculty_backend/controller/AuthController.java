package com.facultyapp.faculty_backend.controller;

import com.facultyapp.faculty_backend.dto.LoginRequest;
import com.facultyapp.faculty_backend.dto.LoginResponse;
import com.facultyapp.faculty_backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
// @CrossOrigin(origins = "http://localhost:5173")
// public class AuthController {

// private final AuthService authService;

// public AuthController(AuthService authService) {
// this.authService = authService;
// }

// @PostMapping("/login")
// public ResponseEntity<LoginResponse> login(
// @RequestBody LoginRequest request) {
// return ResponseEntity.ok(authService.login(request));
// }
// }
// @RestController
// @RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }
}
