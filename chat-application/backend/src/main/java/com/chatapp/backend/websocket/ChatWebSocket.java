package com.chatapp.backend.websocket;

import com.chatapp.backend.models.Message;
import com.chatapp.backend.models.MessageStatus;
import com.chatapp.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocket {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageService messageService;

    @MessageMapping("/message")
    public void handleMessage(Message message) {

        // Typing Event
        if (message.getType() != null &&
                message.getType().equals("typing")) {

            messagingTemplate.convertAndSend(
                    "/topic/typing",
                    message
            );

            return;
        }

        // Save Message
        Message savedMessage =
                messageService.saveMessage(message);

        if (savedMessage == null) {
            return;
        }

        // Mark as Delivered
        savedMessage.setStatus(
                MessageStatus.DELIVERED
        );

        savedMessage =
                messageService.saveMessage(savedMessage);

        // Group Message
        if (
                savedMessage.getGroupId() != null &&
                !savedMessage.getGroupId().isBlank()
        ) {

            messagingTemplate.convertAndSend(
                    "/topic/group/" +
                            savedMessage.getGroupId(),
                    savedMessage
            );

        } else {

            // Private Message
            messagingTemplate.convertAndSend(
                    "/topic/messages",
                    savedMessage
            );

            // Receiver Queue
            if (
                    savedMessage.getReceiverId() != null
            ) {

                messagingTemplate.convertAndSendToUser(
                        savedMessage.getReceiverId(),
                        "/queue/messages",
                        savedMessage
                );
            }
        }
    }
}