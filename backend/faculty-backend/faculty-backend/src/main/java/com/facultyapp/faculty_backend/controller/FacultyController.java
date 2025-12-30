package com.facultyapp.faculty_backend.controller;

import com.facultyapp.faculty_backend.dto.FacultyDirectoryResponse;
import com.facultyapp.faculty_backend.service.FacultyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List; // ✅ IMPORTANT

@RestController
@RequestMapping("/faculty")
@CrossOrigin(origins = "http://localhost:5173")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public ResponseEntity<?> registerFaculty(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam String password,
            @RequestParam String address,
            @RequestParam String subjects,
            @RequestParam String areaOfSpecialisation,
            @RequestParam("aadhaarFile") MultipartFile aadhaarFile) {

        facultyService.registerFaculty(
                name, email, phone, password,
                address, subjects, areaOfSpecialisation, aadhaarFile);

        return ResponseEntity.ok().body(
                java.util.Map.of(
                        "message",
                        "Registration submitted successfully. Please wait for admin approval."));
    }

    // ✅ PUBLIC DIRECTORY
    @GetMapping("/directory")
    public List<FacultyDirectoryResponse> getFacultyDirectory() {
        return facultyService.getFacultyDirectory();
    }

    @GetMapping("/active")
    public List<FacultyDirectoryResponse> getActiveFaculties() {
        return facultyService.getActiveFaculties();
    }

}
