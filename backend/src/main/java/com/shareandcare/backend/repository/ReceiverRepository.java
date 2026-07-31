package com.shareandcare.backend.repository;

import com.shareandcare.backend.model.Receiver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceiverRepository extends JpaRepository<Receiver, Long> {
    List<Receiver> findByEmailOrderByCreatedAtDesc(String email);
}
