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

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.FACULTY);
        user.setEnabled(true);
        userRepository.save(user);

        String aadhaarPath;
        try {
            Path uploadDir = Paths.get("uploads/aadhaar");
            Files.createDirectories(uploadDir);
            aadhaarPath = uploadDir.resolve(
                    UUID.randomUUID() + "_" + aadhaarFile.getOriginalFilename()).toString();

            Files.copy(aadhaarFile.getInputStream(),
                    Paths.get(aadhaarPath),
                    StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception e) {
            throw new RuntimeException("Aadhaar upload failed");
        }

        Faculty faculty = new Faculty();
        faculty.setName(name);
        faculty.setPhone(phone);
        faculty.setAddress(address);
        faculty.setSubjects(subjects);
        faculty.setAreaOfSpecialisation(areaOfSpecialisation);
        faculty.setAadhaarFilePath(aadhaarPath);
        faculty.setStatus(FacultyStatus.PENDING);
        faculty.setDeleted(false);
        faculty.setUser(user);

        facultyRepository.save(faculty);
    }

    // ==========================
    // ADMIN APIs
    // ==========================
    public List<Faculty> getAllFaculties() {
        return facultyRepository.findByDeletedFalse();
    }

    public List<Faculty> getPendingFaculties() {
        return facultyRepository.findByStatusAndDeletedFalse(FacultyStatus.PENDING);
    }

    public void approveFaculty(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        faculty.setStatus(FacultyStatus.ACTIVE);
        facultyRepository.save(faculty);
    }

    public void rejectFaculty(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        faculty.setStatus(FacultyStatus.REJECTED);
        facultyRepository.save(faculty);
    }

    public void deactivateFaculty(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        faculty.setStatus(FacultyStatus.INACTIVE);
        facultyRepository.save(faculty);
    }

    public void activateFaculty(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        faculty.setStatus(FacultyStatus.ACTIVE);
        facultyRepository.save(faculty);
    }

    // ==========================
    // ADMIN: HARD DELETE (DB + FILE)
    // ==========================
    public void deleteFaculty(Long facultyId) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        // 1️⃣ Delete Aadhaar file
        String aadhaarPath = faculty.getAadhaarFilePath();
        if (aadhaarPath != null) {
            try {
                Files.deleteIfExists(Paths.get(aadhaarPath));
            } catch (Exception e) {
                throw new RuntimeException("Failed to delete Aadhaar file");
            }
        }

        // 2️⃣ Delete Faculty record
        facultyRepository.delete(faculty);

        // 3️⃣ Delete linked User
        userRepository.delete(faculty.getUser());
    }

}
