package com.facultyapp.faculty_backend.controller;

import com.facultyapp.faculty_backend.entity.Faculty;
import com.facultyapp.faculty_backend.service.FacultyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final FacultyService facultyService;

    public AdminController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping("/faculties/pending")
    public List<Faculty> getPendingFaculties() {
        return facultyService.getPendingFaculties();
    }

    @PutMapping("/faculty/{id}/approve")
    public String approveFaculty(@PathVariable Long id) {
        facultyService.approveFaculty(id);
        return "Faculty approved";
    }

    @PutMapping("/faculty/{id}/reject")
    public String rejectFaculty(@PathVariable Long id) {
        facultyService.rejectFaculty(id);
        return "Faculty rejected";
    }

    @GetMapping("/test")
    public String adminTest() {
        return "ADMIN ACCESS GRANTED";
    }

    @GetMapping("/faculties")
    public List<Faculty> getAllFaculties() {
        return facultyService.getAllFaculties();
    }

}
