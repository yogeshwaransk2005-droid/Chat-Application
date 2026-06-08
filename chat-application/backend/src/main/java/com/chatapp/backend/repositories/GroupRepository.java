package com.chatapp.backend.repositories;

import com.chatapp.backend.models.Group;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GroupRepository extends MongoRepository<Group, String> {

    List<Group> findByMembersContaining(String userId);
}