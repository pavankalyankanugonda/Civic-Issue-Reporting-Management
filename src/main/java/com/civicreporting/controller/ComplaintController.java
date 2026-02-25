package com.civicreporting.controller;

import com.civicreporting.model.Complaint;
import com.civicreporting.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import jakarta.servlet.http.HttpServletRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5175"})
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<Complaint> addComplaint(@RequestBody Complaint complaint) {
        return ResponseEntity.ok(complaintService.addComplaint(complaint));
    }

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints(@RequestParam(required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(complaintService.getComplaintsByStatus(status));
        }
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PostMapping("/upload-images")
    public ResponseEntity<Map<String, Object>> uploadImages(@RequestParam("files") MultipartFile[] files) {
        Map<String, Object> response = new HashMap<>();
        List<String> imageUrls = new ArrayList<>();

        try {
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }

                // Validate file type
                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    response.put("success", false);
                    response.put("message", "Only image files are allowed");
                    return ResponseEntity.badRequest().body(response);
                }

                // Validate file size (max 5MB per file)
                if (file.getSize() > 5 * 1024 * 1024) {
                    response.put("success", false);
                    response.put("message", "File size exceeds 5MB limit");
                    return ResponseEntity.badRequest().body(response);
                }

                // Generate unique filename
                String originalFilename = file.getOriginalFilename();
                String extension = originalFilename != null && originalFilename.contains(".")
                        ? originalFilename.substring(originalFilename.lastIndexOf("."))
                        : ".jpg";
                String filename = "complaint-" + UUID.randomUUID() + extension;

                // Save to physical location
                java.nio.file.Path uploadPath = java.nio.file.Paths.get("uploads").toAbsolutePath().normalize();
                java.nio.file.Files.createDirectories(uploadPath);
                java.nio.file.Path targetLocation = uploadPath.resolve(filename);
                java.nio.file.Files.copy(file.getInputStream(), targetLocation,
                        java.nio.file.StandardCopyOption.REPLACE_EXISTING);

                String imageUrl = "http://localhost:8080/api/images/" + filename;
                imageUrls.add(imageUrl);
            }

            response.put("success", true);
            response.put("message", "Images uploaded successfully");
            response.put("imageUrls", imageUrls);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to upload images: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Complaint> updateStatus(@PathVariable Long id, @RequestBody(required = false) String statusBody, HttpServletRequest request) {
        try {
            String payload = statusBody;
            if (payload == null) {
                // read raw body if not bound
                payload = request.getReader().lines().collect(Collectors.joining());
            }
            if (payload == null) payload = "";

            String newStatus = payload.replaceAll("\\\"", "").trim();

            // If payload looks like JSON object try parsing for a 'status' field
            if (payload.trim().startsWith("{")) {
                ObjectMapper mapper = new ObjectMapper();
                try {
                    JsonNode node = mapper.readTree(payload);
                    if (node.has("status")) {
                        newStatus = node.get("status").asText();
                    }
                } catch (Exception ex) {
                    // fall back to cleaned payload
                }
            }

            return complaintService.updateStatus(id, newStatus)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception ex) {
            return ResponseEntity.status(400).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaint(@PathVariable Long id) {
        if (complaintService.deleteComplaint(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
