package com.panthars.blue_reserve.dto;

public class AuthResponse {
    private UserDTO user;

    public AuthResponse(UserDTO user) {
        this.user = user;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
}
