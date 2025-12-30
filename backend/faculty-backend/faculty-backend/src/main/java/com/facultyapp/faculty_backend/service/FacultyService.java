package com.facultyapp.faculty_backend.service;

import com.facultyapp.faculty_backend.entity.*;
import com.facultyapp.faculty_backend.repository.FacultyRepository;
import com.facultyapp.faculty_backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.facultyapp.faculty_backend.dto.FacultyDirectoryResponse;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

    public List<FacultyDirectoryResponse> getFacultyDirectory() {

        List<Faculty> faculties = facultyRepository.findByDeletedFalseAndStatusIn(
                List.of(FacultyStatus.ACTIVE, FacultyStatus.INACTIVE));

        return faculties.stream().map(f -> {

            FacultyDirectoryResponse dto = new FacultyDirectoryResponse();

            dto.setId(f.getId());
            dto.setName(f.getName());
            dto.setDepartment(f.getSubjects());
            dto.setRole("Faculty");

            dto.setEmail(f.getUser().getEmail());
            dto.setPhoneExtension(f.getPhone());
            dto.setOfficeLocation(f.getAddress());

            dto.setResearchInterests(
                    List.of(f.getAreaOfSpecialisation().split(",")));

            dto.setStatus(f.getStatus().name());
            dto.setAvailable(f.getStatus() == FacultyStatus.ACTIVE);

            dto.setOfficeHours(
                    f.getStatus() == FacultyStatus.ACTIVE
                            ? "Mon–Fri: 10 AM – 4 PM"
                            : "Currently unavailable");

            return dto;

        }).collect(Collectors.toList());
    }

    public List<FacultyDirectoryResponse> getActiveFaculties() {

        List<Faculty> faculties = facultyRepository.findByStatusAndDeletedFalse(FacultyStatus.ACTIVE);

        return faculties.stream().map(f -> {
            FacultyDirectoryResponse dto = new FacultyDirectoryResponse();

            // 🔥 IMPORTANT: use USER ID for chat
            dto.setId(f.getUser().getId());
            dto.setName(f.getName());
            dto.setEmail(f.getUser().getEmail());
            dto.setRole("Faculty");
            dto.setAvailable(true);

            return dto;
        }).collect(Collectors.toList());
    }

}
