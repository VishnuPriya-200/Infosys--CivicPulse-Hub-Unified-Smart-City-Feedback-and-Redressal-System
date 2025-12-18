package com.civicpulse.backend.controller;

import com.civicpulse.backend.models.Complaint;
import com.civicpulse.backend.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    // -------------------------------------------------
    // ✔ 1. ADD NEW COMPLAINT
    // -------------------------------------------------
    @PostMapping("/add")
    public Map<String, String> addComplaint(
            @RequestParam("name") String name,
            @RequestParam("location") String location,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            String uploadPath = null;

            if (image != null && !image.isEmpty()) {
                String uploadsDir = "uploads/";
                File folder = new File(uploadsDir);
                if (!folder.exists())
                    folder.mkdirs();

                String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                Path filePath = Paths.get(uploadsDir + fileName);

                Files.write(filePath, image.getBytes());
                uploadPath = "uploads/" + fileName; // ⭐ ONLY RELATIVE PATH STORED
            }

            Complaint complaint = new Complaint();
            complaint.setName(name);
            complaint.setLocation(location);
            complaint.setCategory(category);
            complaint.setDescription(description);
            complaint.setImagePath(uploadPath);
            complaint.setStatus("Pending");

            complaintRepository.save(complaint);

            return Map.of("message", "Complaint submitted successfully!");

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", "Failed to submit complaint");
        }
    }

    // -------------------------------------------------
    // ✔ 2. GET ALL COMPLAINTS
    // -------------------------------------------------
    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    // -------------------------------------------------
    // ✔ 3. GET COMPLAINTS ASSIGNED TO OFFICER
    // -------------------------------------------------
    @GetMapping("/assigned/{officerId}")
    public List<Complaint> getAssignedToOfficer(@PathVariable String officerId) {
        return complaintRepository.findByAssignedOfficer(officerId);
    }

    // -------------------------------------------------
    // ✔ 4. UPDATE COMPLAINT (Admin assigns officer)
    // -------------------------------------------------
    @PutMapping("/update/{id}")
    public Complaint updateComplaint(@PathVariable String id, @RequestBody Complaint updatedComplaint) {

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (updatedComplaint.getAssignedOfficer() != null)
            complaint.setAssignedOfficer(updatedComplaint.getAssignedOfficer());

        if (updatedComplaint.getStatus() != null)
            complaint.setStatus(updatedComplaint.getStatus());

        if (updatedComplaint.getDeadline() != null)
            complaint.setDeadline(updatedComplaint.getDeadline());

        if (updatedComplaint.getPriority() != null)
            complaint.setPriority(updatedComplaint.getPriority());

        return complaintRepository.save(complaint);
    }

    // -------------------------------------------------
    // ✔ 5. UPLOAD RESOLVED IMAGE (Officer resolves)
    // -------------------------------------------------
    @PostMapping("/upload-resolved/{id}")
    public Map<String, String> uploadResolvedImage(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        try {
            Complaint complaint = complaintRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Complaint not found"));

            String uploadsDir = "uploads/resolved/";
            File folder = new File(uploadsDir);
            if (!folder.exists())
                folder.mkdirs();

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadsDir + fileName);
            Files.write(filePath, file.getBytes());

            complaint.setResolvedImagePath("uploads/resolved/" + fileName);
            complaint.setStatus("Resolved");

            complaintRepository.save(complaint);

            return Map.of("message", "Resolved image uploaded!");

        } catch (Exception e) {
            return Map.of("error", "Failed to upload resolved image!");
        }
    }

    // -------------------------------------------------
    // ✔ 6. OFFICER STATS
    // -------------------------------------------------
    @GetMapping("/officer-stats")
    public Map<String, Long> getOfficerStats() {
        List<Complaint> complaints = complaintRepository.findAll();

        return complaints.stream()
                .filter(c -> c.getAssignedOfficer() != null && !c.getAssignedOfficer().isEmpty())
                .collect(Collectors.groupingBy(Complaint::getAssignedOfficer, Collectors.counting()));
    }

    // -------------------------------------------------
    // ✔ 7. DAILY STATS
    // -------------------------------------------------
    @GetMapping("/daily-stats")
    public Map<String, Long> getDailyStats() {
        List<Complaint> complaints = complaintRepository.findAll();

        return complaints.stream()
                .collect(Collectors.groupingBy(
                        c -> extractDateFromId(c.getId()),
                        Collectors.counting()));
    }

    private String extractDateFromId(String objectId) {
        try {
            long timestamp = Long.parseLong(objectId.substring(0, 8), 16);
            Date date = new Date(timestamp * 1000);
            return new java.text.SimpleDateFormat("yyyy-MM-dd").format(date);
        } catch (Exception e) {
            return "unknown";
        }
    }

    // -------------------------------------------------
    // ⭐ 8. NEW: CITIZEN FEEDBACK + AUTO-REOPEN LOGIC
    // -------------------------------------------------
    @PutMapping("/feedback/{id}")
    public Map<String, String> submitFeedback(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        int rating = (int) body.get("rating");
        String note = (String) body.get("note");
        boolean reopen = (boolean) body.get("reopen");

        // ⭐ SAVE FEEDBACK PROPERLY
        complaint.setRating(rating);
        complaint.setFeedbackNote(note);
        complaint.setReopened(reopen);

        // ⭐ REOPEN LOGIC (UNCHANGED)
        if (reopen) {
            complaint.setStatus("Pending");
            complaint.setResolvedImagePath("");
        }

        complaintRepository.save(complaint);

        return Map.of(
                "message",
                reopen
                        ? "Complaint reopened due to low feedback!"
                        : "Feedback submitted successfully!");
    }

}
