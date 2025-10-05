package com.panthars.blue_reserve.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingRequest {
    private Long userId;
    private Long managerId;
    private Long seatId;
    private Long slotId;
    private Long cafeteriaId;
    private Long locationId;
    private LocalDate date;
    
}