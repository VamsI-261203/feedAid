package com.shareandcare.backend.controller;

import com.shareandcare.backend.model.Donor;
import com.shareandcare.backend.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/donors")
public class DonorController {

    @Autowired
    private DonorRepository donorRepository;

    @PostMapping
    public ResponseEntity<?> submitDonation(@RequestBody Donor donor) {
        // Validate quantity
        if (donor.getQuantity() == null || donor.getQuantity() < 1) {
            return ResponseEntity.badRequest().body("Quantity must be at least 1.");
        }
        
        // Validate contact (10 digits)
        if (donor.getContact() == null || !donor.getContact().matches("\\d{10}")) {
            return ResponseEntity.badRequest().body("Contact number must be exactly 10 digits.");
        }
        
        // Validate location
        if (donor.getZipcode() == null || !donor.getZipcode().matches("\\d{5,6}")) {
            return ResponseEntity.badRequest().body("Zip code must be 5 or 6 digits.");
        }
        if (donor.getCity() == null || donor.getCity().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("City is required.");
        }
        if (donor.getState() == null || donor.getState().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("State is required.");
        }
        if (donor.getAddress() == null || donor.getAddress().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Address is required.");
        }
        
        // Validate expiry date
        if (donor.getExpiryDate() != null && !donor.getExpiryDate().isEmpty()) {
            try {
                LocalDate expDate = LocalDate.parse(donor.getExpiryDate());
                if (expDate.isBefore(LocalDate.now())) {
                    return ResponseEntity.badRequest().body("Expiration date cannot be in the past.");
                }
            } catch (DateTimeParseException e) {
                return ResponseEntity.badRequest().body("Invalid date format. Use YYYY-MM-DD.");
            }
        } else {
            return ResponseEntity.badRequest().body("Expiration date is required.");
        }

        // Set the initial quantity to track total lifetime donations for the leaderboard
        donor.setInitialQuantity(donor.getQuantity());

        Donor savedDonor = donorRepository.save(donor);
        return ResponseEntity.ok(savedDonor);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<Donor>> getLeaderboard() {
        // Fetch all donations, ignoring privacy flags
        List<Donor> allDonors = donorRepository.findAll();
        
        // Aggregate by email so multiple donations sum up (1 donation = 10 points)
        Map<String, Donor> aggregated = new HashMap<>();
        for (Donor d : allDonors) {
            String key = (d.getEmail() != null && !d.getEmail().isEmpty()) ? d.getEmail() : d.getName();
            
            int pointsForThisDonation = (d.getInitialQuantity() != null ? d.getInitialQuantity() : d.getQuantity()) * 10;

            if (aggregated.containsKey(key)) {
                Donor existing = aggregated.get(key);
                existing.setQuantity(existing.getQuantity() + pointsForThisDonation);
            } else {
                // Clone donor to avoid modifying db state
                Donor clone = new Donor();
                clone.setName(d.getName());
                clone.setCity(d.getCity());
                clone.setQuantity(pointsForThisDonation); // Here quantity is acting as "Points"
                aggregated.put(key, clone);
            }
        }

        List<Donor> topDonors = new ArrayList<>(aggregated.values());
        // Sort by the aggregated points descending
        topDonors.sort((a, b) -> b.getQuantity().compareTo(a.getQuantity()));

        return ResponseEntity.ok(topDonors);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Donor>> searchDonors(
            @RequestParam String city,
            @RequestParam String choice,
            @RequestParam Integer quantity) {
        
        List<Donor> availableDonors = donorRepository.findByCityIgnoreCaseAndChoiceIgnoreCaseAndQuantityGreaterThanEqualOrderByQuantityAsc(
                city, choice, quantity);
        
        return ResponseEntity.ok(availableDonors);
    }

    @GetMapping("/history")
    public ResponseEntity<List<Donor>> getDonorHistory(@RequestParam String email) {
        List<Donor> history = donorRepository.findByEmailOrderByCreatedAtDesc(email);
        return ResponseEntity.ok(history);
    }
}
