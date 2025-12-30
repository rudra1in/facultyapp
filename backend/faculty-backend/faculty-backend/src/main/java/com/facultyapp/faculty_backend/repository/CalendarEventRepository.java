package com.facultyapp.faculty_backend.repository;

import com.facultyapp.faculty_backend.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {

    List<CalendarEvent> findByDateGreaterThanEqual(LocalDate date);
}
