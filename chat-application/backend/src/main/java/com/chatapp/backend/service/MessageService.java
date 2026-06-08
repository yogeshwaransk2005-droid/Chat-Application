package com.chatapp.backend.service;

import com.chatapp.backend.models.Message;
import com.chatapp.backend.models.MessageStatus;
import com.chatapp.backend.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public List<Message> getPrivateConversation(String userA, String userB) {
        return messageRepository.findByGroupIdIsNullAndSenderIdInAndReceiverIdInOrderByCreatedAtAsc(List.of(userA, userB), List.of(userA, userB));
    }

    public List<Message> getGroupMessages(String groupId) {
        return messageRepository.findByGroupIdOrderByCreatedAtAsc(groupId);
    }

    public Optional<Message> markAsRead(String messageId, String userId) {
        return messageRepository.findById(messageId)
                .map(message -> {
                    if (!message.getReadBy().contains(userId)) {
                        message.getReadBy().add(userId);
                    }
                    message.setStatus(MessageStatus.READ);
                    return messageRepository.save(message);
                });
    }

    public Optional<Message> updateContent(String messageId, String newContent) {
        return messageRepository.findById(messageId)
                .map(message -> {
                    message.setContent(newContent);
                    message.setEdited(true);
                    return messageRepository.save(message);
                });
    }

    public void deleteMessage(String messageId) {
        messageRepository.findById(messageId).ifPresent(message -> {
            message.setDeleted(true);
            messageRepository.save(message);
        });
    }
}