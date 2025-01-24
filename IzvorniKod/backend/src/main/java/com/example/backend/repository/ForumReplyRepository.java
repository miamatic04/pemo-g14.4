package com.example.backend.repository;

import com.example.backend.model.ForumReply;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ForumReplyRepository extends JpaRepository<ForumReply, Long> {
}
