package com.panthars.blue_reserve.controller;

import org.springframework.http.ResponseEntity;

import com.panthars.blue_reserve.dto.UserDTO;
import com.panthars.blue_reserve.model.User;
import com.panthars.blue_reserve.repository.UserRepository;
import com.panthars.blue_reserve.service.JwtService;
import com.panthars.blue_reserve.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
        private final JwtService jwtService;

    

    // Get all users (admin use case)
    @GetMapping
public ResponseEntity<List<UserDTO>> getAllUsers() {
    List<User> users = userService.getAllUsers();

    List<UserDTO> userDTOs = users.stream()
            .map(user -> {
                String token = jwtService.generateToken(user.getEmail());
                return new UserDTO(user, token);
            })
            .collect(Collectors.toList());

    return ResponseEntity.ok(userDTOs);
}


    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // Block user
    @PutMapping("/{id}/block")
    public ResponseEntity<Void> blockUser(@PathVariable Long id) {
        userService.blockUser(id);
        return ResponseEntity.noContent().build();
    }

    // Unblock user
    @PutMapping("/{id}/unblock")
    public ResponseEntity<Void> unblockUser(@PathVariable Long id) {
        userService.unblockUser(id);
        return ResponseEntity.noContent().build();
    }

    // Delete user (optional)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Get current user's profile (via JWT)
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String username = userService.extractUsernameFromJWT(authHeader);  // Extract username from JWT
        User user = userService.findByName(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user);
    }

    @PatchMapping("/managers/{managerId}/auto-approve")
    public ResponseEntity<String> setAutoApproval(@PathVariable Long managerId, @RequestParam boolean autoApprove) {
        User manager = userRepository.findById(managerId)
            .orElseThrow(() -> new RuntimeException("Manager not found"));

        manager.setAutoApprove(autoApprove);
        userRepository.save(manager);
        return ResponseEntity.ok("Auto-approval preference updated.");
    }
}
