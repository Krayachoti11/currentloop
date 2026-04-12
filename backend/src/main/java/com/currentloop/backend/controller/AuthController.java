package com.currentloop.backend.controller;

import com.currentloop.backend.model.User;
import com.currentloop.backend.repository.UserRepository;
import com.currentloop.backend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");

        if (username == null || username.isBlank()) {
            return Map.of("error", "Username is required");
        }
        if (email == null || email.isBlank()) {
            return Map.of("error", "Email is required");
        }
        if (password == null || password.length() < 6) {
            return Map.of("error", "Password must be at least 6 characters");
        }

        if (userRepository.findByUsername(username.trim()).isPresent()) {
            return Map.of("error", "Username already taken");
        }

        User user = new User();
        user.setUsername(username.trim());
        user.setEmail(email.trim());
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setCreatedAt(LocalDateTime.now());
        user.setAdmin(false);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername());
        return Map.of("token", token, "username", user.getUsername());
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || username.isBlank() || password == null) {
            return Map.of("error", "Invalid username or password");
        }

        Optional<User> userOpt = userRepository.findByUsername(username.trim());

        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPasswordHash())) {
            return Map.of("error", "Invalid username or password");
        }

        String name = userOpt.get().getUsername();
        String token = jwtUtil.generateToken(name);
        return Map.of("token", token, "username", name);
    }
}
