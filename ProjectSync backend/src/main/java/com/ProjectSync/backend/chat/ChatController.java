package com.ProjectSync.backend.chat;

import com.ProjectSync.backend.appuser.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RequestMapping(path="/users")
@Controller
public class ChatController {

    private final AppUserRepository appUserRepository;
    private ChatService chatService;

    @Autowired
    public ChatController(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        // Handling NEW_COLLABORATOR type within the existing sendMessage method
        if (chatMessage.getType() == MessageType.NEW_COLLABORATOR) {
            // Possibly log the addition of a new collaborator, handle it as needed
            System.out.println("New Collaborator Added: " + chatMessage.getSenderEmail());
        }
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        // Here, chatMessage.getSenderEmail() contains the user's email directly
        // No need to adjust the chatMessage if it's already set correctly
        // Just ensure session attributes or any needed logic utilizes the senderEmail correctly

        String userEmail = chatMessage.getSenderEmail(); // Or getSender(), if not renamed
        headerAccessor.getSessionAttributes().put("username", userEmail); // Storing email as "username" in session

        return chatMessage;
    }

    @Autowired
    public void setChatService(ChatService chatService) {
        this.chatService = chatService;
    }
    @GetMapping("/recent-messages")
    public ResponseEntity<List<ChatMessage>> getRecentMessages() {
        List<ChatMessage> recentMessages = chatService.getRecentMessages();
        return new ResponseEntity<>(recentMessages, HttpStatus.OK);
    }
}
