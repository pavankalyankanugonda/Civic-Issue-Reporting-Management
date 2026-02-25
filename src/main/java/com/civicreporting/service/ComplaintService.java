package com.civicreporting.service;

import com.civicreporting.model.Complaint;
import com.civicreporting.model.User;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ComplaintService {

    private final List<Complaint> complaints = new CopyOnWriteArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public Complaint addComplaint(Complaint complaint) {
        complaint.setComplaintId(idGenerator.getAndIncrement());
        complaint.setCreatedDate(java.time.LocalDateTime.now());
        complaints.add(complaint);
        return complaint;
    }

    public List<Complaint> getAllComplaints() {
        return complaints;
    }

    public List<Complaint> getComplaintsByUser(User user) {
        return complaints.stream()
                .filter(c -> c.getUser().getUserId().equals(user.getUserId()))
                .toList();
    }

    public List<Complaint> getComplaintsByStatus(String status) {
        return complaints.stream()
                .filter(c -> status.equals(c.getStatus()))
                .toList();
    }

    public Optional<Complaint> updateStatus(Long id, String status) {
        return complaints.stream()
                .filter(c -> c.getComplaintId().equals(id))
                .findFirst()
                .map(c -> {
                    c.setStatus(status);
                    return c;
                });
    }

    public boolean deleteComplaint(Long id) {
        return complaints.removeIf(c -> c.getComplaintId().equals(id));
    }
}
