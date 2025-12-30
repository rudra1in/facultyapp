package com.facultyapp.faculty_backend.service;

import com.facultyapp.faculty_backend.entity.CalendarEvent;
import com.facultyapp.faculty_backend.entity.User;
import com.facultyapp.faculty_backend.repository.CalendarEventRepository;
import com.facultyapp.faculty_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CalendarService {

    private final CalendarEventRepository repository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public CalendarService(
            CalendarEventRepository repository,
            UserRepository userRepository,
            NotificationService notificationService) {

        this.repository = repository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    // ================= FETCH UPCOMING EVENTS =================
    public List<CalendarEvent> getUpcomingEvents() {
        return repository.findByDateGreaterThanEqual(LocalDate.now());
    }

    // ================= CREATE EVENT =================
    public CalendarEvent createEvent(CalendarEvent event, String email) {

        User creator = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        event.setCreatedBy(creator);
        event.setUserEvent(true);

        CalendarEvent savedEvent = repository.save(event);

        // 🔔 NOTIFY ALL OTHER USERS
        List<User> users = userRepository.findAll();

        for (User user : users) {
            if (!user.getId().equals(creator.getId())) {
                notificationService.create(
                        user,
                        "Meetings",
                        "meeting_invite",
                        creator.getEmail() + " invited you to a meeting",
                        savedEvent.getTitle());
            }
        }

        return savedEvent;
    }

    // ================= DELETE EVENT =================
    public void deleteEvent(Long id, String email) {

        CalendarEvent event = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getCreatedBy().getEmail().equals(email)) {
            throw new RuntimeException("Not allowed");
        }

        repository.delete(event);
    }
}
