package com.example.backend.service;

import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.Forum;
import com.example.backend.dto.ForumDTO;
import com.example.backend.model.ForumReply;
import com.example.backend.model.Person;
import com.example.backend.repository.ForumReplyRepository;
import com.example.backend.repository.ForumRepository;
import com.example.backend.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ForumService {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private ForumRepository forumRepository;
    @Autowired
    private ForumReplyRepository forumReplyRepository;

    public String startADiscussion(ForumDTO forumDTO, String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        Forum forum = new Forum();
        forum.setTitle(forumDTO.getTitle());
        forum.setText(forumDTO.getText());
        forum.setAuthor(user);
        forum.setDateTime(LocalDateTime.now());
        forumRepository.save(forum);

        return "Discussion started successfully";
    }

    public List<ForumDTO> getAllDiscussions(String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        List<Forum> discussions = forumRepository.findAll();

        return discussions
                .stream()
                .map((discussion) -> {
                    ForumDTO forumDTO = new ForumDTO();
                    forumDTO.setDiscussionId(discussion.getId());
                    forumDTO.setTitle(discussion.getTitle());
                    forumDTO.setText(discussion.getText());
                    forumDTO.setAuthorName(discussion.getAuthor().getName());
                    forumDTO.setAuthorEmail(discussion.getAuthor().getEmail());
                    forumDTO.setDateTime(discussion.getDateTime());
                    if(email.equals(discussion.getAuthor().getEmail())) {
                        forumDTO.setAuthor(true);
                    }
                    return forumDTO;
                })
                .toList();

    }

    public List<ForumDTO> getDiscussionReplies(Long forumId, String token) {

        List<ForumReply> forumReplies = forumReplyRepository.findAll();

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        List<ForumDTO> replies = forumReplies
                .stream()
                .filter((forum) -> forum.getForum().getId().equals(forumId))
                .map((forum) -> {
                    ForumDTO forumDTO = new ForumDTO();
                    forumDTO.setDiscussionId(forum.getId());
                    forumDTO.setAuthorName(forum.getAuthor().getName());
                    forumDTO.setAuthorEmail(forum.getAuthor().getEmail());
                    forumDTO.setText(forum.getText());
                    forumDTO.setDateTime(forum.getDateTime());
                    forumDTO.setAuthor(forum.getAuthor().getEmail().equals(email));
                    return forumDTO;
                })
                .toList();

        return replies;
    }

    public String postReply(Long forumId, ForumDTO forumDto, String token) {
        String email = jwtService.extractUsername(token);
        Person user = personRepository.findByEmail(email);
        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        Forum forum = forumRepository.findById(forumId).orElse(null);

        ForumReply forumReply = new ForumReply();
        forumReply.setForum(forum);
        forumReply.setAuthor(user);
        forumReply.setText(forumDto.getText());
        forumReply.setDateTime(LocalDateTime.now());
        forumReplyRepository.save(forumReply);

        return "Reply posted successfully";
    }

    public String deleteReply(Long replyId) {
        ForumReply forumReply = forumReplyRepository.findById(replyId).orElse(null);
        if(forumReply != null) {
            forumReplyRepository.delete(forumReply);
            return "Reply deleted successfully";
        }

        return "Reply not found";
    }
}
