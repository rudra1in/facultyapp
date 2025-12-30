package com.facultyapp.faculty_backend.repository;

import com.facultyapp.faculty_backend.entity.Message;
import com.facultyapp.faculty_backend.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversationOrderByCreatedAtAsc(Conversation conversation);
}
