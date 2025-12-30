package com.facultyapp.faculty_backend.controller;

import com.facultyapp.faculty_backend.dto.ChatUserResponse;
import com.facultyapp.faculty_backend.entity.User;
import com.facultyapp.faculty_backend.service.UserService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/chat-users")
    public List<ChatUserResponse> chatUsers(Authentication auth) {

        User me = userService.getByEmail(auth.getName());

        return userService.getChatUsers(me)
                .stream()
                .map(u -> {
                    ChatUserResponse dto = new ChatUserResponse();
                    dto.setId(u.getId());
                    dto.setName(u.getEmail()); // later replace with profile name
                    dto.setRole(u.getRole().name());
                    return dto;
                })
                .toList();
    }
}
