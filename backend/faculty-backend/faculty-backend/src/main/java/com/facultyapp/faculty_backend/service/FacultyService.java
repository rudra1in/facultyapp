package com.facultyapp.faculty_backend.service;

import com.facultyapp.faculty_backend.entity.*;
import com.facultyapp.faculty_backend.repository.FacultyRepository;
import com.facultyapp.faculty_backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class FacultyService {

    private final UserRepository userRepository;
    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;

    public FacultyService(
            UserRepository userRepository,
            FacultyRepository facultyRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.facultyRepository = facultyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==========================
    // REGISTER FACULTY
    // ==========================
    public void registerFaculty(
            String name,
            String email,
            String phone,
            String password,
            String address,
            String subjects,
            String areaOfSpecialisation,
            MultipartFile aadhaarFile) {

        if (aadhaarFile == null || aadhaarFile.isEmpty()) {
            throw new RuntimeException("Aadhaar file is required");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // 1️⃣ Create User
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.FACULTY);
        user.setEnabled(true);
        userRepository.save(user);

        // 2️⃣ Save Aadhaar file
        String aadhaarPath;
        try {
            Path uploadDir = Paths.get("uploads/aadhaar");
            Files.createDirectories(uploadDir);

            aadhaarPath = uploadDir.resolve(
                    UUID.randomUUID() + "_" + aadhaarFile.getOriginalFilename()).toString();

            Files.copy(
                    aadhaarFile.getInputStream(),
                    Paths.get(aadhaarPath),
                    StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception e) {
            throw new RuntimeException("Aadhaar upload failed");
        }

        // 3️⃣ Create Faculty
        Faculty faculty = new Faculty();
        faculty.setName(name);
        faculty.setPhone(phone);
        faculty.setAddress(address);
        faculty.setSubjects(subjects);
        faculty.setAreaOfSpecialisation(areaOfSpecialisation);
        faculty.setAadhaarFilePath(aadhaarPath);
        faculty.setStatus(FacultyStatus.PENDING);
        faculty.setUser(user);

        facultyRepository.save(faculty);
    }

    // ==========================
    // ADMIN APIs
    // ==========================
    public List<Faculty> getPendingFaculties() {
        return facultyRepository.findByStatus(FacultyStatus.PENDING);
    }

    public void approveFaculty(Long facultyId) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        faculty.setStatus(FacultyStatus.ACTIVE);
        facultyRepository.save(faculty);
    }

    public void rejectFaculty(Long facultyId) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        faculty.setStatus(FacultyStatus.REJECTED);
        facultyRepository.save(faculty);
    }

    // ==========================
    // ADMIN: GET ALL FACULTY
    // ==========================
    public List<Faculty> getAllFaculties() {
        return facultyRepository.findAll();
    }

}
