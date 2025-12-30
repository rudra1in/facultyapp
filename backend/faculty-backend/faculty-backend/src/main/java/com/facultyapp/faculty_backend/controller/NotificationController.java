package com.facultyapp.faculty_backend.controller;

import com.facultyapp.faculty_backend.entity.User;
import com.facultyapp.faculty_backend.service.NotificationService;
import com.facultyapp.faculty_backend.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService service;
    private final UserService userService;

    public NotificationController(NotificationService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @GetMapping
    public Object myNotifications(Authentication auth) {
        User me = userService.getByEmail(auth.getName());
        return service.getMyNotifications(me);
    }

    @PatchMapping("/{id}/read")
    public void markRead(@PathVariable Long id, Authentication auth) {
        service.markAsRead(id, userService.getByEmail(auth.getName()));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication auth) {
        service.delete(id, userService.getByEmail(auth.getName()));
    }
}
