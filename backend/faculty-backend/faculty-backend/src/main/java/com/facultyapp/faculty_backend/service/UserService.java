package com.facultyapp.faculty_backend.service;

import com.facultyapp.faculty_backend.entity.User;
import com.facultyapp.faculty_backend.entity.Role; // ✅ ADD
import com.facultyapp.faculty_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List; // ✅ ADD

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAllFaculties() {
        return userRepository.findByRole(Role.FACULTY);
    }

    public List<User> getChatUsers(User me) {
        return userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(me.getId())) // exclude self
                .filter(u -> u.getRole().name().equals("ADMIN")
                        || u.getRole().name().equals("FACULTY"))
                .toList();
    }

}
