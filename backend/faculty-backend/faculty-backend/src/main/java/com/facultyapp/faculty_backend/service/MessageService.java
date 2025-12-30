package com.facultyapp.faculty_backend.service;

import com.facultyapp.faculty_backend.dto.MessageResponse;
import com.facultyapp.faculty_backend.entity.*;
import com.facultyapp.faculty_backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepo;
    private final ConversationRepository convoRepo;
    private final NotificationService notificationService;

    public MessageService(
            MessageRepository messageRepo,
            ConversationRepository convoRepo,
            NotificationService notificationService) {

        this.messageRepo = messageRepo;
        this.convoRepo = convoRepo;
        this.notificationService = notificationService;
    }

    // ================= SEND MESSAGE =================
    public MessageResponse sendMessage(Long conversationId, User sender, String content) {

        Conversation convo = convoRepo.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        Message msg = new Message();
        msg.setConversation(convo);
        msg.setSender(sender);
        msg.setContent(content);

        messageRepo.save(msg);

        // 🔔 DETERMINE RECEIVER
        User receiver = convo.getUser1().getId().equals(sender.getId())
                ? convo.getUser2()
                : convo.getUser1();

        // 🔔 CREATE NOTIFICATION FOR RECEIVER
        notificationService.create(
                receiver,
                "Admin", // category
                "new_message", // type
                sender.getEmail() + " sent you a message",
                "Direct Message");

        return map(msg);
    }

    // ================= GET CHAT HISTORY =================
    public List<MessageResponse> getMessages(Long conversationId) {
        Conversation convo = convoRepo.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        return messageRepo
                .findByConversationOrderByCreatedAtAsc(convo)
                .stream()
                .map(this::map)
                .collect(Collectors.toList());
    }

    // ================= DELETE MESSAGE =================
    public void deleteMessage(Long messageId, User user) {
        Message msg = messageRepo.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!msg.getSender().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }

        messageRepo.delete(msg);
    }

    // ================= EDIT MESSAGE =================
    public MessageResponse editMessage(Long messageId, User user, String newText) {
        Message msg = messageRepo.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!msg.getSender().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }

        msg.setContent(newText);
        msg.setEdited(true);

        return map(messageRepo.save(msg));
    }

    // ================= MAPPER =================
    private MessageResponse map(Message m) {
        MessageResponse r = new MessageResponse();
        r.setId(m.getId());
        r.setSenderId(m.getSender().getId());
        r.setSenderName(m.getSender().getEmail());
        r.setContent(m.getContent());
        r.setEdited(m.isEdited());
        r.setCreatedAt(m.getCreatedAt());
        return r;
    }
}
