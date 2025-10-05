package com.panthars.blue_reserve.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.panthars.blue_reserve.model.Slot;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {
}
