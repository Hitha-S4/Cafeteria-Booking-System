package com.panthars.blue_reserve.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.panthars.blue_reserve.model.Role;
import com.panthars.blue_reserve.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    public Role createRole(String name) {
        Role role = new Role();
        role.setName(name);
        return roleRepository.save(role);
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
}

