package com.ProjectSync.backend.chat;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // Method to fetch recent messages with pagination
    List<ChatMessage> findTopNByOrderByIdDesc(); // Adjusted to fetch top 10 messages
}
