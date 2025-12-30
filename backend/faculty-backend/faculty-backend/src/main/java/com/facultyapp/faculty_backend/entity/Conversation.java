package com.facultyapp.faculty_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "conversations")
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // user1 <-> user2 (private chat)
    @ManyToOne
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL)
    private Set<Message> messages;

    // getters & setters

    // ===== Getters & Setters =====

    public Long getId() {
        return id;
    }

    public User getUser1() {
        return user1;
    }

    public void setUser1(User user1) {
        this.user1 = user1;
    }

    public User getUser2() {
        return user2;
    }

    public void setUser2(User user2) {
        this.user2 = user2;
    }

}
