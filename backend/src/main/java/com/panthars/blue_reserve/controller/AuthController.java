package com.panthars.blue_reserve.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.panthars.blue_reserve.dto.AuthResponse;
import com.panthars.blue_reserve.dto.RegisterRequest;
import com.panthars.blue_reserve.dto.UserDTO;
import com.panthars.blue_reserve.model.User;
import com.panthars.blue_reserve.service.JwtService;
import com.panthars.blue_reserve.service.UserService;



@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    @Autowired
    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody User loginRequest) {
       
        User user = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        System.out.println("Login request:>>>>>>>>>>>>###########################<><><><><><><><><><><><><><><><>_______---->" + loginRequest.getName() + " " + loginRequest.getPassword());

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(new UserDTO(user, token));
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest registerRequest) {
        User newUser = userService.createUser(
            registerRequest
        );

        String token = jwtService.generateToken(newUser.getEmail());

        return new AuthResponse(new UserDTO(newUser, token));
    }
}