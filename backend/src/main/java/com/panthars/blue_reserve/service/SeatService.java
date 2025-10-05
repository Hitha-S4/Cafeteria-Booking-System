package com.panthars.blue_reserve.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.panthars.blue_reserve.model.Seat;
import com.panthars.blue_reserve.repository.BookingRepository;
import com.panthars.blue_reserve.repository.SeatRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;

    @Autowired
    public SeatService(SeatRepository seatRepository, BookingRepository bookingRepository) {
        this.seatRepository = seatRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    public Seat getSeatById(Long id) {
        return seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
    }

    public List<Seat> getSeatsByCafeteria(Long cafeteriaId) {
        return seatRepository.findByCafeteriaId(cafeteriaId);
    }

    public Seat createSeat(Seat seat) {
        return seatRepository.save(seat);
    }

    public List<Seat> getAvailableSeats(LocalDate date, Long slotId, Long cafeteriaId) {
    List<Long> bookedSeatIds = bookingRepository.findBookedSeatIds(date, slotId, cafeteriaId);
    if (bookedSeatIds.isEmpty()) {
        // If no seats are booked, return all globally available seats in the cafeteria
        return seatRepository.findByCafeteriaIdAndIsAvailableTrue(cafeteriaId);
    } else {
        // Return available seats excluding those already booked
        return seatRepository.findByCafeteriaIdAndIsAvailableTrueAndIdNotIn(cafeteriaId, bookedSeatIds);
    }
}

}