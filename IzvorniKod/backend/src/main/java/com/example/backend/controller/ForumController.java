package com.example.backend.controller;

import com.example.backend.dto.ForumDTO;
import com.example.backend.service.ForumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ForumController {

    @Autowired
    private ForumService forumService;

    @PostMapping("/postDiscussion")
    public ResponseEntity<String> postDiscussion(@RequestBody ForumDTO forumDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(forumService.startADiscussion(forumDTO, authHeader.substring(7)));
    }

    @GetMapping("/getDiscussions")
    public ResponseEntity<List<ForumDTO>> getAllDiscussions(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(forumService.getAllDiscussions(authHeader.substring(7)));
    }

    @GetMapping("/getDiscussionReplies/{forumId}")
    public ResponseEntity<List<ForumDTO>> getDiscussionReplies(@PathVariable Long forumId, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(forumService.getDiscussionReplies(forumId, authHeader.substring(7)));
    }

    @PostMapping("/postReply/{forumId}")
    public ResponseEntity<String> postReply(@PathVariable Long forumId, @RequestBody ForumDTO forumDTO, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(forumService.postReply(forumId, forumDTO, authHeader.substring(7)));
    }

    @PostMapping("/deleteReply/{replyId}")
    public ResponseEntity<String> deleteReply(@PathVariable Long replyId) {
        return ResponseEntity.ok(forumService.deleteReply(replyId));
    }
}
