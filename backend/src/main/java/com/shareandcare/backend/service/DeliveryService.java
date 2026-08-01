package com.shareandcare.backend.service;

import com.shareandcare.backend.model.Claim;
import com.shareandcare.backend.model.Donor;
import com.shareandcare.backend.repository.ClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;

@Service
public class DeliveryService {

    private static final Logger logger = LoggerFactory.getLogger(DeliveryService.class);

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private EmailService emailService;

    /**
     * Confirm delivery of a claimed donation.
     * 
     * 1. Validates the claim belongs to the receiver
     * 2. Updates status to DELIVERED
     * 3. Sends confirmation email to the donor
     * 
     * If email sending fails, the delivery status is STILL updated (logged but not crashed).
     */
    @Transactional
    public Claim confirmDelivery(Long claimId, String receiverEmail) throws Exception {
        // 1. Find the claim and validate receiver ownership
        Claim claim = claimRepository.findByIdAndReceiverEmail(claimId, receiverEmail)
                .orElseThrow(() -> new Exception("Claim not found or does not belong to this receiver."));

        // 2. Validate current status
        if ("DELIVERED".equals(claim.getStatus())) {
            throw new Exception("This delivery has already been confirmed.");
        }
        if ("CANCELLED".equals(claim.getStatus())) {
            throw new Exception("This claim has been cancelled.");
        }

        // 3. Update status to DELIVERED
        claim.setStatus("DELIVERED");
        claim.setDeliveredAt(LocalDateTime.now());
        Claim savedClaim = claimRepository.save(claim);

        logger.info("Delivery confirmed for claim #{} by receiver: {}", claimId, receiverEmail);

        // 4. Send email to donor (non-blocking — don't let email failure crash the confirmation)
        try {
            Donor donor = claim.getDonor();
            emailService.sendDeliveryConfirmationEmail(
                    donor.getEmail(),
                    donor.getName(),
                    claim.getReceiver().getName(),
                    donor.getItemName(),
                    claim.getQuantityClaimed(),
                    donor.getChoice() + " (" + donor.getType() + ")",
                    savedClaim.getDeliveredAt(),
                    savedClaim.getId()
            );
            logger.info("Delivery confirmation email sent to donor: {}", donor.getEmail());
        } catch (Exception e) {
            // Log the error but DO NOT rethrow — delivery confirmation is already committed
            logger.error("Failed to send delivery confirmation email to donor. " +
                    "Delivery status has been updated successfully. Error: {}", e.getMessage(), e);
        }

        return savedClaim;
    }
}
