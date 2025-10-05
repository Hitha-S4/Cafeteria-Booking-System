package com.panthars.blue_reserve.service;

import com.panthars.blue_reserve.model.Cafeteria;
import com.panthars.blue_reserve.model.Location;
import com.panthars.blue_reserve.repository.CafeteriaRepository;
import com.panthars.blue_reserve.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CafeteriaService {

    private final CafeteriaRepository cafeteriaRepository;
    private final LocationRepository locationRepository;

    // Create a new Cafeteria
    public Cafeteria createCafeteria(String name, Long locationId) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        Cafeteria cafeteria = new Cafeteria();
        cafeteria.setName(name);
        cafeteria.setLocation(location);

        return cafeteriaRepository.save(cafeteria);
    }

    // Get all cafeterias
    public List<Cafeteria> getAllCafeterias() {
        return cafeteriaRepository.findAll();
    }

    // Get cafeterias by location
    public List<Cafeteria> getCafeteriasByLocation(Long locationId) {
        return cafeteriaRepository.findByLocationId(locationId);
    }

    // Get cafeteria by ID
    public Cafeteria getCafeteriaById(Long id) {
        return cafeteriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cafeteria not found"));
    }
}
