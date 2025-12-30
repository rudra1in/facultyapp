package com.facultyapp.faculty_backend.repository;

import com.facultyapp.faculty_backend.entity.Conversation;
import com.facultyapp.faculty_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByUser1AndUser2(User u1, User u2);

    Optional<Conversation> findByUser2AndUser1(User u2, User u1);
}
