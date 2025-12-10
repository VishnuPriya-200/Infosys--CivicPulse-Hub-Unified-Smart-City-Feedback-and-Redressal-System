package com.civicpulse.backend.controller;

import com.civicpulse.backend.models.Officer;
import com.civicpulse.backend.repository.OfficerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/officers")
@CrossOrigin
public class OfficerController {

    @Autowired
    private OfficerRepository officerRepository;

    @GetMapping("/seed")
    public String seedOfficers() {
        officerRepository.save(new Officer("Officer A", "officerA@cp.com", "12345"));
        officerRepository.save(new Officer("Officer B", "officerB@cp.com", "12345"));
        officerRepository.save(new Officer("Officer C", "officerC@cp.com", "12345"));
        return "Officers A, B, C created!";
    }

    @PostMapping("/add")
    public String addOfficer(@RequestBody Officer officer) {

        if (officerRepository.findByEmail(officer.getEmail()) != null) {
            return "Officer with this email already exists!";
        }

        officer.setPassword("12345");
        officer.setRole("Officer");

        officerRepository.save(officer);

        return "Officer added successfully!";
    }

    @GetMapping("/all")
    public List<Officer> getAllOfficers() {
        return officerRepository.findAll();
    }
}
