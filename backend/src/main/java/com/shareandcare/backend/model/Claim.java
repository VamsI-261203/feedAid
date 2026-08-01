package com.shareandcare.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receiver_id", nullable = false)
    private Receiver receiver;

    private Integer quantityClaimed;

    @Column(nullable = false)
    private String status = "CLAIMED"; // CLAIMED, DELIVERED, CANCELLED

    @Column(name = "claimed_at", updatable = false)
    private LocalDateTime claimedAt = LocalDateTime.now();

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    public Claim() {
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Donor getDonor() { return donor; }
    public void setDonor(Donor donor) { this.donor = donor; }

    public Receiver getReceiver() { return receiver; }
    public void setReceiver(Receiver receiver) { this.receiver = receiver; }

    public Integer getQuantityClaimed() { return quantityClaimed; }
    public void setQuantityClaimed(Integer quantityClaimed) { this.quantityClaimed = quantityClaimed; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getClaimedAt() { return claimedAt; }
    public void setClaimedAt(LocalDateTime claimedAt) { this.claimedAt = claimedAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }
}
