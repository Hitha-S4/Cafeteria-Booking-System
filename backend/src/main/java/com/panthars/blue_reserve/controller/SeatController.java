package com.panthars.blue_reserve.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.panthars.blue_reserve.model.Seat;
import com.panthars.blue_reserve.service.SeatService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    private final SeatService seatService;

    @Autowired
    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    // Endpoint to get all seats
    @GetMapping
    public ResponseEntity<List<Seat>> getAllSeats() {
        return ResponseEntity.ok(seatService.getAllSeats());
    }

    // Endpoint to get seat by ID
    @GetMapping("/{id}")
    public ResponseEntity<Seat> getSeatById(@PathVariable Long id) {
        return ResponseEntity.ok(seatService.getSeatById(id));
    }

    
    @GetMapping("/availableSeats")
    public ResponseEntity<List<Seat>> getAvailableSeats( @RequestParam LocalDate date,
    @RequestParam Long slotId,
    @RequestParam Long cafeteriaId){
        List<Seat> seats = seatService.getAvailableSeats(date, slotId, cafeteriaId);
        return ResponseEntity.ok().body(seats);
    }

    @GetMapping("/cafeteria/{cafeteriaId}")
        public List<Seat> getSeatsByCafeteria(@PathVariable Long cafeteriaId) {
        return seatService.getSeatsByCafeteria(cafeteriaId);
    }   
    // Endpoint to create a new seat
    @PostMapping
    public ResponseEntity<Seat> createSeat(@RequestBody Seat seat) {
        Seat newSeat = seatService.createSeat(seat);
        return ResponseEntity.status(201).body(newSeat);
    }
}