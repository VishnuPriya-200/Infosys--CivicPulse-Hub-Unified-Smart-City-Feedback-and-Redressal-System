package com.civicpulse.backend.controller;

import com.civicpulse.backend.models.User;
import com.civicpulse.backend.models.Officer;
import com.civicpulse.backend.repository.UserRepository;
import com.civicpulse.backend.repository.OfficerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private OfficerRepository officerRepo;

    @PostMapping("/login")
    public ResponseEntity<HashMap<String, Object>> login(@RequestBody HashMap<String, String> request) {
        HashMap<String, Object> response = new HashMap<>();

        try {
            String email = request.get("email");
            String password = request.get("password");
            String role = request.get("role");

            if (email == null || password == null || role == null) {
                response.put("message", "email, password and role are required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Citizen
            if ("Citizen".equalsIgnoreCase(role)) {
                User user = userRepo.findByEmail(email);
                if (user != null && password.equals(user.getPassword())) {
                    response.put("role", "Citizen");
                    response.put("user", user);
                    return ResponseEntity.ok(response);
                } else {
                    response.put("message", "Invalid citizen credentials");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                }
            }

            // Admin
            if ("Admin".equalsIgnoreCase(role)) {
                User admin = userRepo.findByEmail(email);
                if (admin != null && password.equals(admin.getPassword())
                        && "Admin".equalsIgnoreCase(admin.getRole())) {
                    response.put("role", "Admin");
                    response.put("admin", admin);
                    return ResponseEntity.ok(response);
                } else {
                    response.put("message", "Invalid admin credentials");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                }
            }

            // Officer
            if ("Officer".equalsIgnoreCase(role)) {
                Officer officer = officerRepo.findByEmail(email);
                if (officer != null && password.equals(officer.getPassword())) {
                    response.put("role", "Officer");
                    response.put("officer", officer);
                    return ResponseEntity.ok(response);
                } else {
                    response.put("message", "Invalid officer credentials");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                }
            }

            response.put("message", "Unknown role");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (Exception ex) {
            // log stacktrace to console so you can see it in server logs
            ex.printStackTrace();

            response.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
