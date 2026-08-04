package com.shareandcare.backend.repository;

import com.shareandcare.backend.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findByClaimId(Long claimId);

    @Query("SELECT cr FROM ChatRoom cr WHERE cr.claim.donor.email = :email OR cr.claim.receiver.email = :email ORDER BY cr.createdAt DESC")
    List<ChatRoom> findChatRoomsByUserEmail(@Param("email") String email);
}
