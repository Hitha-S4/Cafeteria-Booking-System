package com.panthars.blue_reserve.controller;

import com.panthars.blue_reserve.dto.BookingRequest;
import com.panthars.blue_reserve.dto.BookingResponse;
import com.panthars.blue_reserve.mapper.BookingMapper;
import com.panthars.blue_reserve.model.Booking;
import com.panthars.blue_reserve.service.BookingService;
import com.panthars.blue_reserve.utils.BookingStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    private BookingMapper bookingMapper;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Fetch all bookings
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<BookingResponse> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    // Create booking
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            bookingService.createBooking(request);
            return ResponseEntity.ok("Booking request submitted");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating booking: " + e.getMessage());
        }
    }

    @PatchMapping("/{bookingId}/approve")
    public ResponseEntity<BookingResponse> approveBooking(@PathVariable Long bookingId) {
        try {
            // Approve the booking
            Booking booking = bookingService.approveBooking(bookingId);
            // Map to BookingResponse using the mapper
            BookingResponse response = bookingMapper.toResponse(booking);
            return ResponseEntity.ok(response); // Ensure that ResponseEntity is parameterized with BookingResponse
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new BookingResponse(null, null, BookingStatus.PENDING, null, null, null, null, null, null, null, null, null, null, null, null, null));
        }
    }

    @PatchMapping("/{bookingId}/reject")
    public ResponseEntity<BookingResponse> rejectBooking(@PathVariable Long bookingId) {
        try {
            // Reject the booking
            Booking booking = bookingService.rejectBooking(bookingId);
            // Map to BookingResponse using the mapper
            BookingResponse response = bookingMapper.toResponse(booking);
            return ResponseEntity.ok(response); // Again, use ResponseEntity with BookingResponse type
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new BookingResponse(null, null, BookingStatus.REJECTED, null, null, null, null, null, null, null, null, null, null, null, null, null));
        }
    }



    // Check seat availability
    @GetMapping("/checkAvailability")
    public ResponseEntity<Boolean> checkSeatAvailability(@RequestParam Long seatId) {
        boolean available = bookingService.isSeatAvailable(seatId);
        return ResponseEntity.ok(available);
    }

    // Get bookings by user
    @GetMapping("/userBookings")
    public ResponseEntity<List<BookingResponse>> getBookingsByUser(@RequestParam String email) {
        List<BookingResponse> bookings = bookingService.getBookingsByUser(email);
        return ResponseEntity.ok(bookings);
    }

    // Get bookings by seat
    @GetMapping("/seatBookings")
    public ResponseEntity<List<Booking>> getBookingsBySeat(@RequestParam Long seatId) {
        List<Booking> bookings = bookingService.getBookingsBySeat(seatId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/manager/{managerId}/approved")
    public List<BookingResponse> getApprovedBookings(@PathVariable Long managerId) {
        return bookingService.getApprovedBookingsForManager(managerId);
    }
    
    @GetMapping("/manager/{managerId}/pending")
    public List<BookingResponse> getPendingApprovals(@PathVariable Long managerId) {
        return bookingService.getPendingApprovals(managerId);
    }
}
