package com.facultyapp.faculty_backend.repository;

import com.facultyapp.faculty_backend.entity.User;
import com.facultyapp.faculty_backend.entity.Role; // ✅ ADD THIS
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List; // ✅ ADD THIS
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByResetToken(String resetToken);

    List<User> findByRole(Role role);
}
