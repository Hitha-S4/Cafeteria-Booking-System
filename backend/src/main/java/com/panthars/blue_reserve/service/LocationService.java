package com.panthars.blue_reserve.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.panthars.blue_reserve.model.Location;
import com.panthars.blue_reserve.repository.LocationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;

    public Location createLocation(String name) {
        Location location = new Location();
        location.setName(name);
        return locationRepository.save(location);
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Location getLocationByName(String name) {
        return locationRepository.findByName(name)
            .orElseThrow(() -> new RuntimeException("Location not found"));
    }

    public Location getLocationById(Long id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));
    }

    
}

