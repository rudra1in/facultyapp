package com.facultyapp.faculty_backend.repository;

import com.facultyapp.faculty_backend.entity.Faculty;
import com.facultyapp.faculty_backend.entity.FacultyStatus;
import com.facultyapp.faculty_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    Optional<Faculty> findByUser(User user);

    List<Faculty> findByStatus(FacultyStatus status);
}
