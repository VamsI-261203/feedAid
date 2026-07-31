package com.shareandcare.backend.repository;

import com.shareandcare.backend.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {
    List<Donor> findByPrivacyOrderByQuantityDesc(String privacy);
    List<Donor> findByCityIgnoreCaseAndChoiceIgnoreCaseAndQuantityGreaterThanEqualOrderByQuantityAsc(String city, String choice, Integer quantity);
    List<Donor> findByEmailOrderByCreatedAtDesc(String email);
}
