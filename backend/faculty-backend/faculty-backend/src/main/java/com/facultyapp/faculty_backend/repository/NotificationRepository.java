package com.facultyapp.faculty_backend.repository;

import com.facultyapp.faculty_backend.entity.Notification;
import com.facultyapp.faculty_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    List<Notification> findByUserAndReadFalse(User user);
}
