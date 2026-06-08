package com.chatapp.backend.service;

import com.chatapp.backend.models.Message;
import com.chatapp.backend.repositories.MessageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class ChatService {

    @Autowired
    private MessageRepository messageRepository;

    public Message saveMessage(Message message) {

        return messageRepository.save(message);

    }

    public List<Message> getAllMessages() {

        return messageRepository.findAll();

    }

}