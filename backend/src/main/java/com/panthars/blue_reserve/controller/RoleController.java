package com.panthars.blue_reserve.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.panthars.blue_reserve.model.Role;
import com.panthars.blue_reserve.service.RoleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    // Endpoint to create a new role (e.g., ADMIN, MANAGER, etc.)
    @PostMapping
    public ResponseEntity<Role> createRole(@RequestBody String roleName) {
        Role newRole = roleService.createRole(roleName);
        return ResponseEntity.status(HttpStatus.CREATED).body(newRole);
    }

    // Endpoint to get all available roles
    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }
}

