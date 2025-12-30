package com.facultyapp.faculty_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // who receives the notification
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ADMIN / Classes / Meetings / Submissions
    private String category;

    // meeting_invite, new_message, admin_announcement
    private String type;

    @Column(length = 2000)
    private String message;

    // optional (meeting name, subject, etc.)
    private String context;

    private boolean read = false;
    private boolean muted = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    // ======================
    // GETTERS & SETTERS
    // ======================

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public boolean isMuted() {
        return muted;
    }

    public void setMuted(boolean muted) {
        this.muted = muted;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
