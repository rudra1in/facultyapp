package com.facultyapp.faculty_backend.controller;

import com.facultyapp.faculty_backend.entity.CalendarEvent;
import com.facultyapp.faculty_backend.service.CalendarService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/calendar")
@CrossOrigin("*")
public class CalendarController {

    private final CalendarService service;

    public CalendarController(CalendarService service) {
        this.service = service;
    }

    // 🔓 Admin & Faculty can view

    // 🔒 Admin & Faculty can create
    @PostMapping("/events")
    public CalendarEvent createEvent(
            @RequestBody CalendarEvent event,
            Authentication auth) {
        return service.createEvent(event, auth.getName());
    }

    // 🔒 Delete own event
    @DeleteMapping("/events/{id}")
    public void deleteEvent(
            @PathVariable Long id,
            Authentication auth) {
        service.deleteEvent(id, auth.getName());
    }

    @GetMapping("/upcoming")
    public List<CalendarEvent> getUpcomingEvents() {
        return service.getUpcomingEvents(); // ✅ correct
    }

}
