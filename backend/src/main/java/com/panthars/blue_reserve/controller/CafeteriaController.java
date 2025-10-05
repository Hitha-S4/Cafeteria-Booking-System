package com.panthars.blue_reserve.controller;

import com.panthars.blue_reserve.model.Cafeteria;
import com.panthars.blue_reserve.service.CafeteriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cafeterias")
@RequiredArgsConstructor
public class CafeteriaController {

    private final CafeteriaService cafeteriaService;

    @GetMapping
    public List<Cafeteria> getAllCafeterias() {
        return cafeteriaService.getAllCafeterias();
    }

    @GetMapping("/location/{locationId}")
    public List<Cafeteria> getCafeteriasByLocation(@PathVariable Long locationId) {
        return cafeteriaService.getCafeteriasByLocation(locationId);
    }

    @PostMapping
    public Cafeteria createCafeteria(@RequestParam String name, @RequestParam Long locationId) {
        return cafeteriaService.createCafeteria(name, locationId);
    }

    @GetMapping("/cafeteria/{id}")
    public Cafeteria getCafeteriaById(@PathVariable Long id) {
        return cafeteriaService.getCafeteriaById(id);
    }
}
