package com.panthars.blue_reserve.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.panthars.blue_reserve.model.Slot;
import com.panthars.blue_reserve.repository.SlotRepository;

import java.util.List;

@Service
public class SlotService {

    private final SlotRepository slotRepository;

    @Autowired
    public SlotService(SlotRepository slotRepository) {
        this.slotRepository = slotRepository;
    }

    public List<Slot> getAllSlots() {
        return slotRepository.findAll();
    }

    public Slot getSlotById(Long id) {
        return slotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
    }

    public Slot createSlot(Slot slot) {
        return slotRepository.save(slot);
    }
}
