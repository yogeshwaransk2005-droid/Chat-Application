package com.chatapp.backend.controllers;

import com.chatapp.backend.models.Group;
import com.chatapp.backend.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @PostMapping("/create")
    public ResponseEntity<Group> createGroup(@RequestBody Group group) {
        return ResponseEntity.ok(groupService.createGroup(group));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Group>> getGroupsForUser(@PathVariable String userId) {
        return ResponseEntity.ok(groupService.findGroupsByMemberId(userId));
    }
}