package com.facultyapp.faculty_backend.repository;

import com.facultyapp.faculty_backend.entity.Faculty;
import com.facultyapp.faculty_backend.entity.FacultyStatus;
import com.facultyapp.faculty_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    // 🔹 Used in AuthService
    Optional<Faculty> findByUser(User user);

    // 🔹 Admin listings
    List<Faculty> findByStatusAndDeletedFalse(FacultyStatus status);

    List<Faculty> findByDeletedFalse();

    List<Faculty> findByDeletedFalseAndStatusIn(List<FacultyStatus> statuses);

}
