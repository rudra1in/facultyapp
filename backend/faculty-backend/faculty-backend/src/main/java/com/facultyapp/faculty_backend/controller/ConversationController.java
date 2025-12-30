package com.facultyapp.faculty_backend.controller;

import com.facultyapp.faculty_backend.entity.User;
import com.facultyapp.faculty_backend.service.ConversationService;
import com.facultyapp.faculty_backend.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/conversations")
public class ConversationController {

    private final ConversationService service;
    private final UserService userService;

    public ConversationController(ConversationService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @PostMapping("/{otherUserId}")
    public Long create(Authentication auth, @PathVariable Long otherUserId) {
        User me = userService.getByEmail(auth.getName());
        User other = userService.getById(otherUserId);
        return service.findOrCreate(me, other).getId();
    }
}
