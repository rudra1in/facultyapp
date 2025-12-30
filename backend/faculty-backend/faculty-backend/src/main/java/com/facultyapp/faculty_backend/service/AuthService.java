package com.facultyapp.faculty_backend.service;

import com.facultyapp.faculty_backend.dto.LoginRequest;
import com.facultyapp.faculty_backend.dto.LoginResponse;
import com.facultyapp.faculty_backend.dto.UserProfileResponse;
import com.facultyapp.faculty_backend.entity.Faculty;
import com.facultyapp.faculty_backend.entity.FacultyStatus;
import com.facultyapp.faculty_backend.entity.Role;
import com.facultyapp.faculty_backend.entity.User;
import com.facultyapp.faculty_backend.repository.FacultyRepository;
import com.facultyapp.faculty_backend.repository.UserRepository;
import com.facultyapp.faculty_backend.security.JwtUtil;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.nio.file.Path;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

        public UserProfileResponse getMyProfile(String email) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                UserProfileResponse dto = new UserProfileResponse();
                dto.setId(user.getId());
                dto.setEmail(user.getEmail());
                dto.setRole(user.getRole().name());

                if (user.getRole() == Role.ADMIN) {
                        dto.setName("System Administrator");
                        dto.setDepartment("Administration");
                        dto.setStatus("ACTIVE");
                }

                if (user.getRole() == Role.FACULTY) {
                        Faculty faculty = facultyRepository.findByUser(user)
                                        .orElseThrow(() -> new RuntimeException("Faculty not found"));

                        dto.setName(faculty.getName());
                        dto.setDepartment(faculty.getSubjects());
                        dto.setPhone(faculty.getPhone());
                        dto.setOffice(faculty.getAddress());
                        dto.setStatus(faculty.getStatus().name());
                }

                dto.setProfileImage(user.getProfileImage());

                return dto;
        }

        public void updateProfilePhoto(String email, MultipartFile file) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                try {
                        // 1️⃣ Create directory if not exists
                        Path uploadDir = Paths.get("uploads/profile");
                        Files.createDirectories(uploadDir);

                        // 2️⃣ Generate unique filename
                        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

                        // 3️⃣ Save file
                        Path filePath = uploadDir.resolve(filename);
                        Files.copy(
                                        file.getInputStream(),
                                        filePath,
                                        StandardCopyOption.REPLACE_EXISTING);

                        // 4️⃣ Save ONLY filename in DB
                        user.setProfileImage(filename);
                        userRepository.save(user);

                } catch (Exception e) {
                        throw new RuntimeException("Profile image upload failed", e);
                }
        }

}
