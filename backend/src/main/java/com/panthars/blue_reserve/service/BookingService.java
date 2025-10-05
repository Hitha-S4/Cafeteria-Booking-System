package com.panthars.blue_reserve.service;

import com.panthars.blue_reserve.dto.BookingRequest;
import com.panthars.blue_reserve.dto.BookingResponse;
import com.panthars.blue_reserve.mapper.BookingMapper;
import com.panthars.blue_reserve.model.Booking;
import com.panthars.blue_reserve.model.Seat;
import com.panthars.blue_reserve.model.User;
import com.panthars.blue_reserve.repository.*;

import com.panthars.blue_reserve.utils.BookingStatus;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final SlotRepository slotRepository;
    private final CafeteriaRepository cafeteriaRepository;
    private final LocationRepository locationRepository;

    @Autowired
    public BookingService(
        BookingRepository bookingRepository,
        SeatRepository seatRepository,
        UserRepository userRepository,
        SlotRepository slotRepository,
        CafeteriaRepository cafeteriaRepository,
        LocationRepository locationRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.seatRepository = seatRepository;
        this.userRepository = userRepository;
        this.slotRepository = slotRepository;
        this.cafeteriaRepository = cafeteriaRepository;
        this.locationRepository = locationRepository;
    }

    @Autowired
    private BookingMapper bookingMapper;



      // Fetch all bookings and convert them to BookingResponse DTOs
      public List<BookingResponse> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream()
                       .map(bookingMapper::toResponse)  // Use the mapper to convert Booking to BookingResponse
                       .collect(Collectors.toList());
    }

    // Check if a seat is available
    public boolean isSeatAvailable(Long seatId) {
        Optional<Seat> seat = seatRepository.findById(seatId);
        return seat.isPresent() && seat.get().isAvailable();
    }

    private User getAdminUser() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream().anyMatch(r -> r.getName().equalsIgnoreCase("ADMIN")))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Admin user not found"));
    }

    // Create a booking
    @Transactional
    public void createBooking(BookingRequest request) {
        Booking booking = new Booking();




        User manager = userRepository.findById(request.getManagerId())
        .orElseThrow(() -> new RuntimeException("Manager not found"));

        booking.setManager(manager);

        // Check if auto-approval is enabled
        if (manager.isAutoApprove()) {
            booking.setStatus(BookingStatus.APPROVED);

            if (manager.getBlueDollars() < 10) {
                throw new RuntimeException("Manager does not have enough blue dollars");
            }

            // Deduct from manager
            manager.setBlueDollars(manager.getBlueDollars() - 10);
            userRepository.save(manager);

            // Credit to admin
            User admin = getAdminUser();
            admin.setBlueDollars(admin.getBlueDollars() + 10);
            userRepository.save(admin);
        } else {
            booking.setStatus(BookingStatus.PENDING);
        }


        booking.setUser(userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found")));
       
        booking.setSeat(seatRepository.findById(request.getSeatId())
                .orElseThrow(() -> new RuntimeException("Seat not found")));
        booking.setSlot(slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found")));
        booking.setCafeteria(cafeteriaRepository.findById(request.getCafeteriaId())
                .orElseThrow(() -> new RuntimeException("Cafeteria not found")));
        booking.setLocation(locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found")));
        booking.setDate(request.getDate());
        booking.setCreatedAt(LocalDateTime.now());
        booking.setActive(true);

        bookingRepository.save(booking);
    }

    @Transactional
    public void updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
    
        booking.setStatus(status);
        bookingRepository.save(booking);
    
        if (status == BookingStatus.APPROVED) {
            User manager = booking.getManager();
            if (manager == null) {
                throw new RuntimeException("Manager not assigned to this booking");
            }
            int currentBalance = manager.getBlueDollars();
            if (currentBalance < 10) {
                throw new RuntimeException("Manager has insufficient Blue Dollars");
            }
            manager.setBlueDollars(currentBalance - 10);
            userRepository.save(manager);
        }
    }
    
    

    // Get bookings by user name
    public List<BookingResponse> getBookingsByUser(String email) {
        List<Booking> bookings = 
        bookingRepository.findByUser_Email(email);
        return bookings.stream().map(b -> new BookingResponse(
            b.getId(),
            b.getDate(),
            b.getStatus(),
            b.getCreatedAt(),
            b.getSeat().getName(),
            b.getSeat().getId(),
            b.getSlot().getId(),
            b.getSlot().getTimeRange(),
            b.getCafeteria().getId(),
            b.getCafeteria().getName(),
            b.getLocation().getId(),
            b.getLocation().getName(),
            b.getUser().getName(),
            b.getUser().getId(),
            b.getManager().getId(),
            b.getManager().getName()
        )).toList();
    }

    // Get bookings by seat ID
    public List<Booking> getBookingsBySeat(Long seatId) {
        return bookingRepository.findBySeatId(seatId);
    }

    public List<BookingResponse> getApprovedBookingsForManager(Long managerId) {
        List<Booking> bookings = bookingRepository
            .findByManagerIdAndStatus(managerId, BookingStatus.APPROVED);
        return bookings.stream()
            .map(bookingMapper::toResponse)
            .collect(Collectors.toList());
    }
    
    public List<BookingResponse> getPendingApprovals(Long managerId) {
        // Pass a List of BookingStatus instead of a single BookingStatus
        List<BookingStatus> statuses = List.of(BookingStatus.PENDING);
        List<Booking> bookings = bookingRepository.findByManagerIdAndStatusIn(managerId, statuses);
        return bookings.stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    // Approve a booking
    @Transactional
    public Booking approveBooking(Long bookingId) throws Exception {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);

        if (!optionalBooking.isPresent()) {
            throw new Exception("Booking not found");
        }

        Booking booking = optionalBooking.get();

        // Check if booking is already approved or rejected
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new Exception("Booking is already approved or rejected");
        }

        // Deduct 10 blue dollars from the manager
        User manager = booking.getManager();
        if (manager.getBlueDollars() < 10) {
            throw new Exception("Manager does not have enough blue dollars");
        }

        manager.setBlueDollars(manager.getBlueDollars() - 10);
        userRepository.save(manager);

        // Credit admin
        User admin = getAdminUser();
        admin.setBlueDollars(admin.getBlueDollars() + 10);
        userRepository.save(admin);

         // Update booking status to approved
         booking.setStatus(BookingStatus.APPROVED);

        // Save updated booking
        return bookingRepository.save(booking);
    }

    // Reject a booking
    @Transactional
    public Booking rejectBooking(Long bookingId) throws Exception {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);

        if (!optionalBooking.isPresent()) {
            throw new Exception("Booking not found");
        }

        Booking booking = optionalBooking.get();

        // Check if booking is already approved or rejected
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new Exception("Booking is already approved or rejected");
        }

        // Update booking status to rejected
        booking.setStatus(BookingStatus.REJECTED);
        return bookingRepository.save(booking);
    }

}
