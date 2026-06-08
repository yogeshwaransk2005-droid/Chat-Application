package com.chatapp.backend.controllers;

import com.chatapp.backend.models.Message;
import com.chatapp.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        Message saved = messageService.saveMessage(message);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/conversation/private")
    public ResponseEntity<List<Message>> getPrivateConversation(
            @RequestParam String userA,
            @RequestParam String userB
    ) {
        return ResponseEntity.ok(messageService.getPrivateConversation(userA, userB));
    }

    @GetMapping("/conversation/group")
    public ResponseEntity<List<Message>> getGroupConversation(
            @RequestParam String groupId
    ) {
        return ResponseEntity.ok(messageService.getGroupMessages(groupId));
    }

    @PutMapping("/{messageId}/edit")
    public ResponseEntity<?> editMessage(
            @PathVariable String messageId,
            @RequestBody Message updated
    ) {
        return messageService.updateContent(messageId, updated.getContent())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable String messageId) {
        messageService.deleteMessage(messageId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{messageId}/read")
    public ResponseEntity<?> markRead(
            @PathVariable String messageId,
            @RequestParam String userId
    ) {
        return messageService.markAsRead(messageId, userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}