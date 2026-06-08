package com.chatapp.backend.repositories;

import com.chatapp.backend.models.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    List<Message> findByGroupIdOrderByCreatedAtAsc(String groupId);

    List<Message> findByGroupIdIsNullAndSenderIdInAndReceiverIdInOrderByCreatedAtAsc(List<String> senders, List<String> receivers);

}