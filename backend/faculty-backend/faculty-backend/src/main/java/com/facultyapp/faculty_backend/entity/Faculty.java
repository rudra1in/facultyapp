package com.facultyapp.faculty_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "faculty")
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================
    // BASIC DETAILS
    // =====================

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String subjects; // comma separated (Java,DSA)

    @Column(nullable = false)
    private String areaOfSpecialisation;

    // =====================
    // STATUS
    // =====================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FacultyStatus status = FacultyStatus.PENDING;

    @Column(nullable = false)
    private boolean deleted = false;

    // =====================
    // FILE STORAGE (AADHAAR)
    // =====================

    @Column(nullable = false)
    private String aadhaarFilePath;

    // =====================
    // RELATIONSHIP
    // =====================

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // =====================
    // CONSTRUCTORS
    // =====================

    public Faculty() {
    }

    public Faculty(String name, String phone, String address,
            String subjects, String areaOfSpecialisation,
            String aadhaarFilePath, User user) {
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.subjects = subjects;
        this.areaOfSpecialisation = areaOfSpecialisation;
        this.aadhaarFilePath = aadhaarFilePath;
        this.user = user;
        this.status = FacultyStatus.PENDING;
        this.deleted = false;
    }

    // =====================
    // GETTERS & SETTERS
    // =====================

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getSubjects() {
        return subjects;
    }

    public void setSubjects(String subjects) {
        this.subjects = subjects;
    }

    public String getAreaOfSpecialisation() {
        return areaOfSpecialisation;
    }

    public void setAreaOfSpecialisation(String areaOfSpecialisation) {
        this.areaOfSpecialisation = areaOfSpecialisation;
    }

    public FacultyStatus getStatus() {
        return status;
    }

    public void setStatus(FacultyStatus status) {
        this.status = status;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public String getAadhaarFilePath() {
        return aadhaarFilePath;
    }

    public void setAadhaarFilePath(String aadhaarFilePath) {
        this.aadhaarFilePath = aadhaarFilePath;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
