package com.civicreporting.controller;

import com.civicreporting.model.User;
import com.civicreporting.service.OtpService;
import com.civicreporting.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5175"}) // Allow common dev ports
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Backend is running perfectly!");
    }

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, Object>> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        System.out.println("Received request for email: " + email);
        if (email == null || email.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Email is required");
            return ResponseEntity.badRequest().body(error);
        }
        
        try {
            Map<String, Object> response = otpService.generateOtp(email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Exception in sendOtp: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to send OTP: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody Map<String, Object> request) {
        String otp = (String) request.get("otp");
        String email = (String) request.get("email");
        if (!otpService.verifyOtp(email, otp)) {
            return ResponseEntity.badRequest().body(null);
        }
        User user = new User();
        user.setName((String) request.get("name"));
        user.setEmail(email);
        user.setPassword((String) request.get("password"));
        user.setRole((String) request.get("role"));
        user.setPhone((String) request.get("phone"));
        try {
            return ResponseEntity.ok(userService.registerUser(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User loginRequest) {
        return userService.login(loginRequest.getEmail(), loginRequest.getPassword())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
