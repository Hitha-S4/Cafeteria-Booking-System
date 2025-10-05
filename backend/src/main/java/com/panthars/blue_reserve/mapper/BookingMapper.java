package com.panthars.blue_reserve.mapper;

import com.panthars.blue_reserve.dto.BookingResponse;
import com.panthars.blue_reserve.model.Booking;
import org.springframework.stereotype.Component;



@Component
public class BookingMapper {

    public BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
            booking.getId(),
            booking.getDate(),
            booking.getStatus(),
            booking.getCreatedAt(),

            booking.getSeat().getName(),
            booking.getSeat().getId(),

            booking.getSlot().getId(),
            booking.getSlot().getTimeRange(),

            booking.getCafeteria().getId(),
            booking.getCafeteria().getName(),

            booking.getLocation().getId(),
            booking.getLocation().getName(),

            booking.getUser().getName(),
            booking.getUser().getId(),

            booking.getManager().getId(),
            booking.getManager().getName()
        );
    }
}