package com.facultyapp.faculty_backend.service;

import com.facultyapp.faculty_backend.entity.Conversation;
import com.facultyapp.faculty_backend.entity.User;
import com.facultyapp.faculty_backend.repository.ConversationRepository;
import org.springframework.stereotype.Service;

@Service
public class ConversationService {

    private final ConversationRepository repo;

    public ConversationService(ConversationRepository repo) {
        this.repo = repo;
    }

    public Conversation findOrCreateAdminBroadcast(User admin, User faculty) {
        return findOrCreate(admin, faculty);
    }

    public Conversation findOrCreate(User u1, User u2) {
        return repo.findByUser1AndUser2(u1, u2)
                .or(() -> repo.findByUser2AndUser1(u1, u2))
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setUser1(u1);
                    c.setUser2(u2);
                    return repo.save(c);
                });
    }
}
