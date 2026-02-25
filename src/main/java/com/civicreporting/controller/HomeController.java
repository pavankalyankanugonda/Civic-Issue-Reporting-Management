package com.civicreporting.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping({"/", "/api", "/api/"})
    public ResponseEntity<Map<String, String>> home() {
        Map<String, String> body = new HashMap<>();
        body.put("status", "ok");
        body.put("message", "Civic Reporting API is running");
        return ResponseEntity.ok(body);
    }
}