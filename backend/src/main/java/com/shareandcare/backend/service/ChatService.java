package com.shareandcare.backend.service;

import com.shareandcare.backend.model.ChatMessage;
import com.shareandcare.backend.model.ChatRoom;
import com.shareandcare.backend.model.Claim;
import com.shareandcare.backend.repository.ChatMessageRepository;
import com.shareandcare.backend.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Autowired
    public ChatService(ChatRoomRepository chatRoomRepository, ChatMessageRepository chatMessageRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    /**
     * Create a new chat room for an accepted claim.
     */
    @Transactional
    public ChatRoom createChatRoom(Claim claim) {
        // Double check if a room already exists for this claim
        return chatRoomRepository.findByClaimId(claim.getId())
                .orElseGet(() -> chatRoomRepository.save(new ChatRoom(claim)));
    }

    /**
     * Deactivate a chat room once delivery is confirmed.
     */
    @Transactional
    public void deactivateChatRoom(Long claimId) {
        chatRoomRepository.findByClaimId(claimId).ifPresent(room -> {
            room.setActive(false);
            chatRoomRepository.save(room);
        });
    }

    /**
     * Send a message within a chat room. Includes security authorization.
     */
    @Transactional
    public ChatMessage saveMessage(Long roomId, String senderEmail, String messageText) throws Exception {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found."));

        if (!room.isActive()) {
            throw new IllegalStateException("This chat has been disabled as food collection was confirmed.");
        }

        Claim claim = room.getClaim();
        String donorEmail = claim.getDonor().getEmail();
        String receiverEmail = claim.getReceiver().getEmail();

        // Security check: Only assigned donor and receiver can participate
        if (!senderEmail.equalsIgnoreCase(donorEmail) && !senderEmail.equalsIgnoreCase(receiverEmail)) {
            throw new SecurityException("Access Denied: You are not authorized to send messages in this room.");
        }

        String recipientEmail = senderEmail.equalsIgnoreCase(donorEmail) ? receiverEmail : donorEmail;

        ChatMessage message = new ChatMessage(
                room,
                claim.getDonor().getId(),
                senderEmail,
                recipientEmail,
                messageText
        );

        return chatMessageRepository.save(message);
    }

    /**
     * Get message history with security check.
     */
    @Transactional(readOnly = true)
    public List<ChatMessage> getMessages(Long roomId, String userEmail) throws Exception {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found."));

        Claim claim = room.getClaim();
        String donorEmail = claim.getDonor().getEmail();
        String receiverEmail = claim.getReceiver().getEmail();

        // Security check: Only assigned donor and receiver can view messages
        if (!userEmail.equalsIgnoreCase(donorEmail) && !userEmail.equalsIgnoreCase(receiverEmail)) {
            throw new SecurityException("Access Denied: You are not authorized to view messages in this room.");
        }

        return chatMessageRepository.findByChatRoomIdOrderByTimestampAsc(roomId);
    }

    /**
     * Fetch all chat rooms for a user.
     */
    @Transactional(readOnly = true)
    public List<ChatRoom> getChatRoomsForUser(String userEmail) {
        return chatRoomRepository.findChatRoomsByUserEmail(userEmail);
    }
}
