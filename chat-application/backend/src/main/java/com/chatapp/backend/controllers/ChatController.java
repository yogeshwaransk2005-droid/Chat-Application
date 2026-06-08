package com.chatapp.backend.controllers;

import com.chatapp.backend.models.Message;

import org.springframework.messaging.handler.annotation.MessageMapping;

import org.springframework.messaging.handler.annotation.SendTo;

import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/sendMessage")

    @SendTo("/topic/messages")

    public Message sendMessage(
            Message message
    ) {

        System.out.println(
                "Message Received: "
                        + message.getContent()
        );

        return message;
    }
}