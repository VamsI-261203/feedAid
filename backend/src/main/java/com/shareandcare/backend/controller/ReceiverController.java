package com.shareandcare.backend.controller;

import com.shareandcare.backend.model.Donor;
import com.shareandcare.backend.model.Receiver;
import com.shareandcare.backend.repository.DonorRepository;
import com.shareandcare.backend.repository.ReceiverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/receivers")
public class ReceiverController {

    @Autowired
    private ReceiverRepository receiverRepository;

    @Autowired
    private DonorRepository donorRepository;

    @PostMapping
    public ResponseEntity<String> submitReceiver(@RequestBody Receiver receiver) {
        if (receiver.getQuantity() == null || receiver.getQuantity() < 1) {
            return ResponseEntity.badRequest().body("Quantity must be at least 1.");
        }
        if (receiver.getContact() == null || !receiver.getContact().matches("\\d{10}")) {
            return ResponseEntity.badRequest().body("Contact number must be exactly 10 digits.");
        }

        Receiver savedReceiver = receiverRepository.save(receiver);

        List<Donor> matches = donorRepository.findByCityIgnoreCaseAndChoiceIgnoreCaseAndQuantityGreaterThanEqualOrderByQuantityAsc(
                receiver.getCity(), receiver.getChoice(), receiver.getQuantity());

        if (!matches.isEmpty()) {
            Donor matchedDonor = matches.get(0);
            
            matchedDonor.setQuantity(matchedDonor.getQuantity() - receiver.getQuantity());
            donorRepository.save(matchedDonor);

            String matchMessage = "MATCH FOUND!\n\n"
                    + "Donor Name: " + matchedDonor.getName() + "\n"
                    + "Contact: " + matchedDonor.getContact() + "\n"
                    + "Address: " + matchedDonor.getAddress() + ", " + matchedDonor.getCity() + "\n\n"
                    + "Please contact them to collect your requested food.";
            
            return ResponseEntity.ok(matchMessage);
        } else {
            return ResponseEntity.ok("Request submitted successfully!\n\nWe currently do not have a donor matching your exact needs in your city, but your request is saved and we will notify you when one becomes available.");
        }
    }

    @PostMapping("/claim/{donorId}")
    public ResponseEntity<String> claimDonor(@PathVariable Long donorId, @RequestBody Receiver receiver) {
        if (receiver.getQuantity() == null || receiver.getQuantity() < 1) {
            return ResponseEntity.badRequest().body("Quantity must be at least 1.");
        }
        if (receiver.getContact() == null || !receiver.getContact().matches("\\d{10}")) {
            return ResponseEntity.badRequest().body("Contact number must be exactly 10 digits.");
        }

        // Save the receiver
        receiverRepository.save(receiver);

        // Find the donor
        Donor donor = donorRepository.findById(donorId).orElse(null);
        if (donor != null && donor.getQuantity() >= receiver.getQuantity()) {
            // Deduct quantity
            donor.setQuantity(donor.getQuantity() - receiver.getQuantity());
            donorRepository.save(donor);

            String matchMessage = "MATCH CONFIRMED!\n\n"
                    + "Donor Name: " + donor.getName() + "\n"
                    + "Contact: " + donor.getContact() + "\n"
                    + "Address: " + donor.getAddress() + ", " + donor.getCity() + "\n\n"
                    + "Please contact them to collect your requested food.";
            
            return ResponseEntity.ok(matchMessage);
        } else {
            return ResponseEntity.badRequest().body("Failed to claim. The food might have already been claimed or is unavailable.");
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<Receiver>> getReceiverHistory(@RequestParam String email) {
        List<Receiver> history = receiverRepository.findByEmailOrderByCreatedAtDesc(email);
        return ResponseEntity.ok(history);
    }
}
