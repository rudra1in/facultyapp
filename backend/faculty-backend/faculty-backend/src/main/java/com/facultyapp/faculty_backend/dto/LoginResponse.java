package com.facultyapp.faculty_backend.dto;

public class LoginResponse {

    private String token;
    private String role;
    private String status;

    public LoginResponse(String token, String role, String status) {
        this.token = token;
        this.role = role;
        this.status = status;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public String getStatus() {
        return status;
    }
}
