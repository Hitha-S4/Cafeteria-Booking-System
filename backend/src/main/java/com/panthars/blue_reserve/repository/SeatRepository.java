package com.panthars.blue_reserve.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.panthars.blue_reserve.model.Seat;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByCafeteriaId(Long cafeteriaId);

    List<Seat> findByCafeteriaIdAndIsAvailableTrue(Long cafeteriaId);

List<Seat> findByCafeteriaIdAndIsAvailableTrueAndIdNotIn(Long cafeteriaId, List<Long> excludedIds);
}