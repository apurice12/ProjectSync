package com.ProjectSync.backend.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class ChatService {

    private final ChatMessageRepository messageRepository;
    private ChatService chatService;

    @Autowired
    public void WebSocketController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        ChatMessage savedMessage = chatService.saveMessage(chatMessage);
        return savedMessage;
    }
    @Autowired
    public ChatService(ChatMessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public List<ChatMessage> getAllMessages() {
        return messageRepository.findAll();
    }

    public ChatMessage saveMessage(ChatMessage message) {
        return messageRepository.save(message);
    }
    public List<ChatMessage> getRecentMessages() {
        // Retrieve the recent messages from the database
        List<ChatMessage> recentMessages = messageRepository.findTopNByOrderByIdDesc(); // Assuming there's a method in your repository to fetch recent messages

        // Reverse the order of messages to maintain chronological order
        Collections.reverse(recentMessages);

        return recentMessages;
    }
}