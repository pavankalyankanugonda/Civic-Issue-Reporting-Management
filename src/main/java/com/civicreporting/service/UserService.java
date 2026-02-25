package com.civicreporting.service;

import com.civicreporting.model.User;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class UserService {

    private final List<User> users = new CopyOnWriteArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public User registerUser(User user) {
        if (users.stream().anyMatch(u -> u.getEmail().equals(user.getEmail()))) {
            throw new RuntimeException("Email already registered");
        }
        user.setUserId(idGenerator.getAndIncrement());
        users.add(user);
        return user;
    }

    public Optional<User> login(String email, String password) {
        return users.stream()
                .filter(user -> user.getEmail().equals(email) && user.getPassword().equals(password))
                .findFirst();
    }

    public Optional<User> getUserById(Long id) {
        return users.stream()
                .filter(user -> user.getUserId().equals(id))
                .findFirst();
    }
}
