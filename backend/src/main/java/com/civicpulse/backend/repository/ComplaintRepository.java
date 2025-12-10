package com.civicpulse.backend.repository;

import com.civicpulse.backend.models.Complaint;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ComplaintRepository extends MongoRepository<Complaint, String> {
    List<Complaint> findByAssignedOfficer(String assignedOfficer);
}
