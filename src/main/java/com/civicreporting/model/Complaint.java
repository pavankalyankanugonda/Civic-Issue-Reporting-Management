package com.civicreporting.model;

import java.time.LocalDateTime;
import java.util.List;

public class Complaint {
    private Long complaintId;
    private String title;
    private String description;
    private String category;
    private String location;
    private Double latitude;
    private Double longitude;
    private List<String> imageUrls;
    private String status = "Pending";
    private User user;
    private LocalDateTime createdDate = LocalDateTime.now();

    // Constructors
    public Complaint() {
    }

    public Complaint(Long complaintId, String title, String description, String category, String location,
                     Double latitude, Double longitude, List<String> imageUrls, String status, User user, LocalDateTime createdDate) {
        this.complaintId = complaintId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.imageUrls = imageUrls;
        this.status = status;
        this.user = user;
        this.createdDate = createdDate;
    }

    // Getters and Setters
    public Long getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(Long complaintId) {
        this.complaintId = complaintId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    @Override
    public String toString() {
        return "Complaint{" +
                "complaintId=" + complaintId +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", category='" + category + '\'' +
                ", location='" + location + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", imageUrls=" + imageUrls +
                ", status='" + status + '\'' +
                ", user=" + user +
                ", createdDate=" + createdDate +
                '}';
    }
}

