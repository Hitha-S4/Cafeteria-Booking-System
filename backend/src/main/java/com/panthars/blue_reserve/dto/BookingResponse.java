package com.panthars.blue_reserve.dto;

import com.panthars.blue_reserve.utils.BookingStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingResponse {
    public Long id;
    public LocalDate date;
    public BookingStatus status;
    public LocalDateTime createdAt;

    public String seatName;
    public Long seatId;

    public Long slotId;
    public String slotTime;

    public Long cafeteriaId;
    public String cafeteriaName;

    public Long locationId;
    public String locationName;

    public String name;
    public Long userId;

    public Long managerId;
    public String managerName;

    

    public BookingResponse(Long id, LocalDate date, BookingStatus status, LocalDateTime createdAt, String seatName,
            Long seatId, Long slotId, String slotTime, Long cafeteriaId, String cafeteriaName, Long locationId,
            String locationName, String name, Long userId, Long managerId, String managerName) {
        this.id = id;
        this.date = date;
        this.status = status;
        this.createdAt = createdAt;
        this.seatName = seatName;
        this.seatId = seatId;
        this.slotId = slotId;
        this.slotTime = slotTime;
        this.cafeteriaId = cafeteriaId;
        this.cafeteriaName = cafeteriaName;
        this.locationId = locationId;
        this.locationName = locationName;
        this.name = name;
        this.userId = userId;
        this.managerId = managerId;
        this.managerName = managerName;
    }
}
