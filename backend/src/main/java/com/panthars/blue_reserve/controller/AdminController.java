package com.panthars.blue_reserve.controller;

// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// import com.panthars.blue_reserve.model.Booking;
// import com.panthars.blue_reserve.service.BookingService;
import com.panthars.blue_reserve.service.UserService;
// import com.panthars.blue_reserve.service.WaitlistService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    // private final BookingService bookingService;
    private final UserService userService;
    // private final WaitlistService waitlistService;

    // // Endpoint to get all bookings (admin only)
    // @GetMapping("/bookings")
    // public ResponseEntity<List<Booking>> getAllBookings() {
    //     List<Booking> bookings = bookingService.getAllBookings();
    //     return ResponseEntity.ok(bookings);
    // }

    // Endpoint to generate booking reports (admin only)
    // @GetMapping("/reports")
    // public ResponseEntity<Map<String, Object>> generateReports() {
    //     Map<String, Object> reportData = new HashMap<>();
    //     // Add data to the report (e.g., total bookings, waitlist status)
    //     reportData.put("totalBookings", bookingService.getTotalBookings());
    //     reportData.put("waitlistStatus", waitlistService.getAllWaitlistEntries());
    //     return ResponseEntity.ok(reportData);
    // }

    // Endpoint to block a user (e.g., after exceeding penalty points limit)
    @PutMapping("/users/{id}/block")
    public ResponseEntity<Void> blockUser(@PathVariable Long id) {
        userService.blockUser(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}

