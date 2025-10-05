package com.panthars.blue_reserve.repository;

import com.panthars.blue_reserve.model.Cafeteria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CafeteriaRepository extends JpaRepository<Cafeteria, Long> {
    List<Cafeteria> findByLocationId(Long locationId);
}
