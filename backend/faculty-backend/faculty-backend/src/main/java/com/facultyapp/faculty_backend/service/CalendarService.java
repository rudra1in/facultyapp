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

    public CalendarService(CalendarEventRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    // 🔹 Fetch all upcoming events
    public List<CalendarEvent> getUpcomingEvents() {
        return repository.findByDateGreaterThanEqual(LocalDate.now());
    }

    // 🔹 Create event (Admin & Faculty)
    public CalendarEvent createEvent(CalendarEvent event, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();

        event.setCreatedBy(user);
        event.setUserEvent(true);

        return repository.save(event);
    }

    // 🔹 Delete event (only owner)
    public void deleteEvent(Long id, String email) {
        CalendarEvent event = repository.findById(id).orElseThrow();

        if (!event.getCreatedBy().getEmail().equals(email)) {
            throw new RuntimeException("Not allowed");
        }

        repository.delete(event);
    }
}
