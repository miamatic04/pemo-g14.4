package com.example.backend.service;

import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.Forum;
import com.example.backend.model.ForumDTO;
import com.example.backend.model.Person;
import com.example.backend.repository.ForumRepository;
import com.example.backend.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ForumService {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private ForumRepository forumRepository;

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
                    forumDTO.setTitle(discussion.getTitle());
                    forumDTO.setText(discussion.getText());
                    forumDTO.setAuthorName(discussion.getAuthor().getName());
                    forumDTO.setAuthorEmail(discussion.getAuthor().getEmail());
                    if(email.equals(discussion.getAuthor().getEmail())) {
                        forumDTO.setAuthor(true);
                    }
                    return forumDTO;
                })
                .toList();

    }
}
