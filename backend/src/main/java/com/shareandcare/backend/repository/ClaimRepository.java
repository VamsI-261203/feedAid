package com.shareandcare.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shareandcare.backend.model.Claim;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByReceiverEmailOrderByClaimedAtDesc(String email);
    List<Claim> findByDonorEmailOrderByClaimedAtDesc(String email);
    Optional<Claim> findByIdAndReceiverEmail(Long id, String email);
}