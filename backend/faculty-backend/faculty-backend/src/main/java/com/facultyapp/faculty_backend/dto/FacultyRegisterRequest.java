package com.facultyapp.faculty_backend.dto;

public class FacultyRegisterRequest {

    private String name;
    private String email;
    private String phone;
    private String password;
    private String address;
    private String subjects;
    private String areaOfSpecialisation;

    // getters & setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
}
