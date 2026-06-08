package com.chatapp.backend.repositories;

import com.chatapp.backend.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepository
        extends MongoRepository<User, String> {

    User findByEmail(String email);

    List<User> findByOnlineTrue();
}