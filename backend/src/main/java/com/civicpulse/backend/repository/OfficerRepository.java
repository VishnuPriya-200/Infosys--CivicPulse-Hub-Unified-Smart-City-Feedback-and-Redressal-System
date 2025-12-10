package com.civicpulse.backend.repository;

import com.civicpulse.backend.models.Officer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OfficerRepository extends MongoRepository<Officer, String> {
    Officer findByEmail(String email);
}
