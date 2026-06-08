package com.chatapp.backend.controllers;

import com.chatapp.backend.config.JwtUtil;
import com.chatapp.backend.dto.AuthResponse;
import com.chatapp.backend.dto.LoginRequest;
import com.chatapp.backend.dto.SignupRequest;
import com.chatapp.backend.models.User;
import com.chatapp.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/api/auth", "/auth"})
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping({"/signup", "/register"})
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (request.getEmail() == null || request.getPassword() == null || request.getUsername() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "All signup fields are required."));
        }

        if (authService.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists."));
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setOnline(false);

        User created = authService.registerUser(user);
        String token = jwtUtil.generateToken(created.getId(), created.getUsername(), created.getEmail());

        AuthResponse response = new AuthResponse(token, created.getId(), created.getUsername(), created.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required."));
        }

        return authService.findByEmail(request.getEmail())
                .map(user -> {
                    if (!authService.verifyPassword(request.getPassword(), user.getPassword())) {
                        return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials."));
                    }

                    user.setOnline(true);
                    authService.saveUser(user);

                    String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getEmail());
                    AuthResponse response = new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.badRequest().body(Map.of("error", "No user found with that email.")));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(name = "Authorization", required = false) String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Missing token."));
        }

        String token = authorization.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token."));
        }

        String userId = jwtUtil.extractUserId(token);
        return authService.findById(userId)
                .map(user -> ResponseEntity.ok(Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "avatarUrl", user.getAvatarUrl(),
                        "online", user.isOnline()
                )))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "User not found.")));
    }

    @GetMapping("/online")
    public ResponseEntity<?> onlineUsers() {
        return ResponseEntity.ok(authService.getOnlineUsers());
    }

    @GetMapping("/users")
    public ResponseEntity<?> allUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }
}