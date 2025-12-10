package com.civicpulse.backend.service;

import com.civicpulse.backend.models.User;
import com.civicpulse.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // REGISTER USER
    public String register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return "Email already exists";
        }
        userRepository.save(user);
        return "User registered";
    }

    // LOGIN USER
    public User login(String email, String password) {
        User existingUser = userRepository.findByEmail(email);

        if (existingUser == null) {
            return null; // user not found
        }

        if (!existingUser.getPassword().equals(password)) {
            return null; // wrong password
        }

        return existingUser; // login success
    }
}
