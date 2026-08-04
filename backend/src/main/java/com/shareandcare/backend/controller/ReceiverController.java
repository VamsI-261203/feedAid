package com.shareandcare.backend.controller;

import com.shareandcare.backend.model.Claim;
import com.shareandcare.backend.model.Donor;
import com.shareandcare.backend.model.Receiver;
import com.shareandcare.backend.repository.ClaimRepository;
import com.shareandcare.backend.repository.DonorRepository;
import com.shareandcare.backend.repository.ReceiverRepository;
import com.shareandcare.backend.service.DeliveryService;
import com.shareandcare.backend.service.ChatService;
import com.shareandcare.backend.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/receivers")
public class ReceiverController {

    @Autowired
    private ReceiverRepository receiverRepository;

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private DeliveryService deliveryService;

    @Autowired
    private ChatService chatService;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

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

            // Create a Claim record to track this match
            Claim claim = new Claim();
            claim.setDonor(matchedDonor);
            claim.setReceiver(savedReceiver);
            claim.setQuantityClaimed(receiver.getQuantity());
            claim.setStatus("ACCEPTED");
            claimRepository.save(claim);

            // Auto-create private chat room for this accepted claim
            chatService.createChatRoom(claim);

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
        Receiver savedReceiver = receiverRepository.save(receiver);

        // Find the donor
        Donor donor = donorRepository.findById(donorId).orElse(null);
        if (donor != null && donor.getQuantity() >= receiver.getQuantity()) {
            // Deduct quantity
            donor.setQuantity(donor.getQuantity() - receiver.getQuantity());
            donorRepository.save(donor);

            // Create a Claim record to track this claim
            Claim claim = new Claim();
            claim.setDonor(donor);
            claim.setReceiver(savedReceiver);
            claim.setQuantityClaimed(receiver.getQuantity());
            claim.setStatus("ACCEPTED");
            claimRepository.save(claim);

            // Auto-create private chat room for this accepted claim
            chatService.createChatRoom(claim);

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

    /**
     * Get all claims for a receiver (by email).
     * Returns claim details with donor info and delivery status.
     */
    @GetMapping("/claims")
    public ResponseEntity<?> getReceiverClaims(@RequestParam String email) {
        List<Claim> claims = claimRepository.findByReceiverEmailOrderByClaimedAtDesc(email);

        // Build response with all needed details (avoid sending sensitive donor data)
        List<Map<String, Object>> claimList = claims.stream().map(claim -> {
            Map<String, Object> claimMap = new HashMap<>();
            claimMap.put("id", claim.getId());
            Long chatRoomId = chatRoomRepository.findByClaimId(claim.getId())
                    .map(com.shareandcare.backend.model.ChatRoom::getId)
                    .orElse(null);
            claimMap.put("chatRoomId", chatRoomId);
            claimMap.put("quantityClaimed", claim.getQuantityClaimed());
            claimMap.put("status", claim.getStatus());
            claimMap.put("claimedAt", claim.getClaimedAt());
            claimMap.put("deliveredAt", claim.getDeliveredAt());

            // Donor details (safe to share)
            Map<String, Object> donorInfo = new HashMap<>();
            donorInfo.put("name", claim.getDonor().getName());
            donorInfo.put("itemName", claim.getDonor().getItemName());
            donorInfo.put("choice", claim.getDonor().getChoice());
            donorInfo.put("type", claim.getDonor().getType());
            donorInfo.put("city", claim.getDonor().getCity());
            donorInfo.put("photoBase64", claim.getDonor().getPhotoBase64());
            claimMap.put("donor", donorInfo);

            // Receiver name
            claimMap.put("receiverName", claim.getReceiver().getName());

            return claimMap;
        }).toList();

        return ResponseEntity.ok(claimList);
    }

    /**
     * Confirm delivery of a claimed donation.
     * Sends a professional HTML email to the donor.
     * 
     * POST /api/receivers/claims/{claimId}/confirm-delivery?email=receiver@email.com
     */
    @PostMapping("/claims/{claimId}/confirm-delivery")
    public ResponseEntity<?> confirmDelivery(
            @PathVariable Long claimId,
            @RequestParam String email) {
        try {
            Claim confirmedClaim = deliveryService.confirmDelivery(claimId, email);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Delivery confirmed successfully! The donor has been notified via email.");
            response.put("claimId", confirmedClaim.getId());
            response.put("status", confirmedClaim.getStatus());
            response.put("deliveredAt", confirmedClaim.getDeliveredAt());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<Receiver>> getReceiverHistory(@RequestParam String email) {
        List<Receiver> history = receiverRepository.findByEmailOrderByCreatedAtDesc(email);
        return ResponseEntity.ok(history);
    }

    /**
     * Get all claims made on a donor's donations (by email).
     * Used to show claim list on donor's profile.
     */
    @GetMapping("/claims/donor")
    public ResponseEntity<?> getDonorClaims(@RequestParam String email) {
        List<Claim> claims = claimRepository.findByDonorEmailOrderByClaimedAtDesc(email);

        List<Map<String, Object>> claimList = claims.stream().map(claim -> {
            Map<String, Object> claimMap = new HashMap<>();
            claimMap.put("id", claim.getId());
            Long chatRoomId = chatRoomRepository.findByClaimId(claim.getId())
                    .map(com.shareandcare.backend.model.ChatRoom::getId)
                    .orElse(null);
            claimMap.put("chatRoomId", chatRoomId);
            claimMap.put("quantityClaimed", claim.getQuantityClaimed());
            claimMap.put("status", claim.getStatus());
            claimMap.put("claimedAt", claim.getClaimedAt());
            claimMap.put("deliveredAt", claim.getDeliveredAt());

            // Receiver details
            Map<String, Object> receiverInfo = new HashMap<>();
            receiverInfo.put("name", claim.getReceiver().getName());
            receiverInfo.put("contact", claim.getReceiver().getContact());
            receiverInfo.put("email", claim.getReceiver().getEmail());
            claimMap.put("receiver", receiverInfo);

            // Donor item details
            Map<String, Object> donorInfo = new HashMap<>();
            donorInfo.put("itemName", claim.getDonor().getItemName());
            donorInfo.put("choice", claim.getDonor().getChoice());
            donorInfo.put("type", claim.getDonor().getType());
            claimMap.put("donor", donorInfo);

            return claimMap;
        }).toList();

        return ResponseEntity.ok(claimList);
    }
}
