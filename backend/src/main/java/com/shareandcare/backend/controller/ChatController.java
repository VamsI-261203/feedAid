package com.shareandcare.backend.controller;

import com.shareandcare.backend.model.ChatMessage;
import com.shareandcare.backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ChatController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Handles live STOMP messages received at /app/chat/{roomId}
     */
    @MessageMapping("/chat/{roomId}")
    public void handleLiveMessage(@DestinationVariable Long roomId, MessagePayload payload) {
        try {
            ChatMessage savedMessage = chatService.saveMessage(
                    roomId,
                    payload.getSenderEmail(),
                    payload.getMessage()
            );
            // Broadcast the persisted message to all subscribers of this specific room
            messagingTemplate.convertAndSend("/topic/chat/" + roomId, savedMessage);
        } catch (Exception e) {
            System.err.println("Error processing real-time message: " + e.getMessage());
            // Broadcast failure payload to sender or logs
            messagingTemplate.convertAndSend("/topic/chat/" + roomId + "/errors", e.getMessage());
        }
    }

    public static class MessagePayload {
        private String senderEmail;
        private String message;

        public MessagePayload() {}

        public String getSenderEmail() { return senderEmail; }
        public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
