package com.facultyapp.faculty_backend.service;

import com.facultyapp.faculty_backend.entity.Notification;
import com.facultyapp.faculty_backend.entity.User;
import com.facultyapp.faculty_backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repo;

    public NotificationService(NotificationRepository repo) {
        this.repo = repo;
    }

    public void create(
            User user,
            String category,
            String type,
            String message,
            String context) {

        Notification n = new Notification();
        n.setUser(user);
        n.setCategory(category);
        n.setType(type);
        n.setMessage(message);
        n.setContext(context);

        repo.save(n);
    }

    public List<Notification> getMyNotifications(User user) {
        return repo.findByUserOrderByCreatedAtDesc(user);
    }

    public void markAsRead(Long id, User user) {
        Notification n = repo.findById(id).orElseThrow();

        if (!n.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }

        n.setRead(true);
        repo.save(n);
    }

    public void delete(Long id, User user) {
        Notification n = repo.findById(id).orElseThrow();

        if (!n.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }

        repo.delete(n);
    }
}
