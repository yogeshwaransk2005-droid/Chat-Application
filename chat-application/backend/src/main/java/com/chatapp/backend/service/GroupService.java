package com.chatapp.backend.service;

import com.chatapp.backend.models.Group;
import com.chatapp.backend.repositories.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }

    public List<Group> findGroupsByMemberId(String userId) {
        return groupRepository.findByMembersContaining(userId);
    }
}