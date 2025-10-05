package com.panthars.blue_reserve.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.panthars.blue_reserve.dto.RegisterRequest;
import com.panthars.blue_reserve.model.Role;
import com.panthars.blue_reserve.model.User;
import com.panthars.blue_reserve.repository.RoleRepository;
import com.panthars.blue_reserve.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService{

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private final JwtService jwtService;
    @Value("${external.api.url}")
    private String externalApiUrl;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    public User authenticate(String email, String password) {

        if(!isVaildEmail(email)){
            throw new IllegalArgumentException("Invalid email address");
        }
        // Retrieve the user by username
        Optional<User> user = userRepository.findByEmail(email);

        if (user == null) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        // Check if the password matches the stored password (hashed)
        if(user.isPresent()){
            if (!passwordEncoder.matches(password, user.get().getPassword())) {
                throw new IllegalArgumentException("Invalid username or password");
            }
        }
       

        // Return the authenticated user
        return user.get();
    }

      @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        if(!isVaildEmail(email)){
            throw new IllegalArgumentException("Invalid email address");
        }
        // Fetch the user by username from the DB (or another source)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRoles().stream()
                    .map(Role::getName)
                    .toArray(String[]::new))  // Assuming your User has a role
                .build();
    }
    

     // Get user by ID
     public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    // Method to extract username from JWT token
    public String extractUsernameFromJWT(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid token");
        }

        String token = authHeader.substring(7);  // Extract JWT from the "Bearer <token>" header
        return jwtService.extractUsernameFromJWT(token);  // Delegate to JwtService
    }
    

  public User createUser(RegisterRequest request) {
    if(!isVaildEmail(request.getEmail())){
        throw new IllegalArgumentException("Invalid email address");
    }
    User user = new User();
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setEnabled(true);
    user.setAvatar(request.getAvatar());
    user.setBlueDollars(100);

    // if (request.getManagerId() != null) {
        User manager = userRepository.findById(Long.parseLong("2"))
            .orElseThrow(() -> new RuntimeException("Manager not found"));
        user.setManager(manager);
    // }

    Set<Role> roles = new HashSet<>();
    Role role = roleRepository.findByName(request.getRole().toUpperCase())
        .orElseThrow(() -> new RuntimeException("Role not found"));
    roles.add(role);

    user.setRoles(roles);
    return userRepository.save(user);
}

    public Optional<User> findByName(String name) {
        return userRepository.findByName(name);
    }

    public Optional<User> findByEmail(String email) {
        if(!isVaildEmail(email)){
            throw new IllegalArgumentException("Invalid email address");
        }
        return userRepository.findByEmail(email);
    }

    public User updateUserRoles(Long userId, Set<String> newRoles) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Set<Role> roles = new HashSet<>();
        for (String roleName : newRoles) {
            Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));
            roles.add(role);
        }

        user.setRoles(roles);
        return userRepository.save(user);
    }

    // public User updatePenaltyPoints(Long userId, int penaltyPoints) {
    //     User user = userRepository.findById(userId)
    //         .orElseThrow(() -> new RuntimeException("User not found"));
        
    //     user.setPenaltyPoints(penaltyPoints);
    //     return userRepository.save(user);
    // }

    public void blockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(false);
        userRepository.save(user);
    }

     // Unblock the user
     public void unblockUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);
    }


    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    // Method to get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();  // Fetch all users from the repository
    }

    public boolean isVaildEmail(String email) {
        //  String externalUrl = externalApiUrl + email;
        // ResponseEntity<String> response = restTemplate.exchange(
        //     externalUrl,
        //     HttpMethod.GET,
        //     null,
        //     String.class
        // );
        // return response.getStatusCode().is2xxSuccessful();
        return true;
    }

    
}

