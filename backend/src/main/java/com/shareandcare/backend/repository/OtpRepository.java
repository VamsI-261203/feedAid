package com.shareandcare.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.shareandcare.backend.model.OtpEntity;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpEntity, Long> {
    Optional<OtpEntity> findByEmailAndPurpose(String email, String purpose);
    void deleteByEmailAndPurpose(String email, String purpose);
}
