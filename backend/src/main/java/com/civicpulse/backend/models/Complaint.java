package com.civicpulse.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "complaints")
public class Complaint {

    @Id
    private String id;

    private String name;
    private String location;
    private String category;
    private String description;
    private String imagePath;

    // Admin assignment fields
    private String assignedOfficer = "";
    private String deadline = "";
    private String priority = "Normal";
    private String status = "Pending";

    // Officer resolved image
    private String resolvedImagePath = "";

    // ⭐⭐⭐ NEW FEEDBACK FIELDS ⭐⭐⭐
    private Integer rating = null; // 1–5 stars
    private String feedbackNote = ""; // optional text
    private boolean reopened = false; // if rating <= 2 → true

    public Complaint() {
    }

    public Complaint(String name, String location, String category, String description, String imagePath) {
        this.name = name;
        this.location = location;
        this.category = category;
        this.description = description;
        this.imagePath = imagePath;
    }

    // ------------------ GETTERS & SETTERS ------------------

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getAssignedOfficer() {
        return assignedOfficer;
    }

    public void setAssignedOfficer(String assignedOfficer) {
        this.assignedOfficer = assignedOfficer;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResolvedImagePath() {
        return resolvedImagePath;
    }

    public void setResolvedImagePath(String resolvedImagePath) {
        this.resolvedImagePath = resolvedImagePath;
    }

    // ⭐⭐⭐ NEW FEEDBACK FIELD GETTERS/SETTERS ⭐⭐⭐

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getFeedbackNote() {
        return feedbackNote;
    }

    public void setFeedbackNote(String feedbackNote) {
        this.feedbackNote = feedbackNote;
    }

    public boolean isReopened() {
        return reopened;
    }

    public void setReopened(boolean reopened) {
        this.reopened = reopened;
    }
}
