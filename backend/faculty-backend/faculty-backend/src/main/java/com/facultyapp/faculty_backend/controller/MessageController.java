package com.facultyapp.faculty_backend.controller;

import com.facultyapp.faculty_backend.dto.SendMessageRequest;
import com.facultyapp.faculty_backend.entity.*;
import com.facultyapp.faculty_backend.service.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.facultyapp.faculty_backend.dto.MessageResponse;
import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    private final MessageService service;
    private final UserService userService;

    public MessageController(MessageService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @PostMapping
    public MessageResponse send(Authentication auth, @RequestBody SendMessageRequest req) {
        User user = userService.getByEmail(auth.getName());
        return service.sendMessage(req.getConversationId(), user, req.getContent());
    }

    @GetMapping("/{conversationId}")
    public List<MessageResponse> history(@PathVariable Long conversationId) {
        return service.getMessages(conversationId);
    }

    @DeleteMapping("/{messageId}")
    public void delete(Authentication auth, @PathVariable Long messageId) {
        service.deleteMessage(messageId, userService.getByEmail(auth.getName()));
    }

    @PutMapping("/{messageId}")
    public MessageResponse edit(
            Authentication auth,
            @PathVariable Long messageId,
            @RequestBody SendMessageRequest req) {

        User user = userService.getByEmail(auth.getName());
        return service.editMessage(messageId, user, req.getContent());
    }
}
