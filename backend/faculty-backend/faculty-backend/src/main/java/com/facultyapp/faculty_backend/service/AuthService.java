package com.facultyapp.faculty_backend.service;

import com.facultyapp.faculty_backend.dto.LoginRequest;
import com.facultyapp.faculty_backend.dto.LoginResponse;
import com.facultyapp.faculty_backend.entity.Faculty;
import com.facultyapp.faculty_backend.entity.FacultyStatus;
import com.facultyapp.faculty_backend.entity.Role;
import com.facultyapp.faculty_backend.entity.User;
import com.facultyapp.faculty_backend.repository.FacultyRepository;
import com.facultyapp.faculty_backend.repository.UserRepository;
import com.facultyapp.faculty_backend.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

        private final AuthenticationManager authenticationManager;
        private final UserRepository userRepository;
        private final FacultyRepository facultyRepository;
        private final JwtUtil jwtUtil;

        public AuthService(
                        AuthenticationManager authenticationManager,
                        UserRepository userRepository,
                        FacultyRepository facultyRepository,
                        JwtUtil jwtUtil) {
                this.authenticationManager = authenticationManager;
                this.userRepository = userRepository;
                this.facultyRepository = facultyRepository;
                this.jwtUtil = jwtUtil;
        }

        // ==============================
        // LOGIN
        // ==============================
        public LoginResponse login(LoginRequest request) {

                // 1️⃣ Authenticate email + password
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                // 2️⃣ Load user
                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (!user.isEnabled()) {
                        throw new RuntimeException("User account is disabled");
                }

                // 3️⃣ ADMIN LOGIN
                if (user.getRole() == Role.ADMIN) {
                        String token = jwtUtil.generateToken(
                                        user.getEmail(),
                                        user.getRole().name());
                        return new LoginResponse(token, "ADMIN", "ACTIVE");
                }

                // 4️⃣ FACULTY STATUS CHECK
                Faculty faculty = facultyRepository.findByUser(user)
                                .orElseThrow(() -> new RuntimeException("Faculty profile not found"));

                if (faculty.getStatus() != FacultyStatus.ACTIVE) {
                        return new LoginResponse(
                                        null,
                                        "FACULTY",
                                        faculty.getStatus().name());
                }

                // 5️⃣ GENERATE TOKEN
                String token = jwtUtil.generateToken(
                                user.getEmail(),
                                user.getRole().name());

                return new LoginResponse(
                                token,
                                "FACULTY",
                                faculty.getStatus().name());
        }
}
