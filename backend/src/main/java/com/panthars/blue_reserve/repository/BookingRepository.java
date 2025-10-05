package com.panthars.blue_reserve.repository;

import com.panthars.blue_reserve.model.Booking;
import com.panthars.blue_reserve.utils.BookingStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("SELECT b.seat.id FROM Booking b WHERE b.date = :date AND b.slot.id = :slotId AND b.cafeteria.id = :cafeteriaId AND b.status in ('PENDING', 'APPROVED')")
    List<Long> findBookedSeatIds(@Param("date") LocalDate date, @Param("slotId") Long slotId, @Param("cafeteriaId") Long cafeteriaId);
    


    // Find all bookings for a specific seat
    List<Booking> findBySeatId(Long seatId);

    List<Booking> findByUser_Email(String email);

    List<Booking> findByManagerIdAndStatus(Long managerId, BookingStatus status);
    List<Booking> findByManagerIdAndStatusIn(Long managerId, List<BookingStatus> statuses);
   

}