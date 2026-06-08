package com.chatapp.backend.websocket;

import com.chatapp.backend.models.Message;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import org.springframework.stereotype.Component;

@Component

public class MessageListener {

    private final SimpMessagingTemplate messagingTemplate;

    public MessageListener(SimpMessagingTemplate messagingTemplate) {

        this.messagingTemplate = messagingTemplate;

    }

    public void sendMessage(Message message) {

        messagingTemplate.convertAndSend(
                "/topic/messages",
                message
        );

    }

}