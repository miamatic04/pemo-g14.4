package com.example.backend.service;

import com.example.backend.exception.RequestAlreadySubmittedException;
import com.example.backend.exception.UnauthorizedActionException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.ModeratingActivity;
import com.example.backend.model.Person;
import com.example.backend.model.PromotionRequest;
import com.example.backend.dto.PromotionRequestDTO;
import com.example.backend.repository.ModeratingActivityRepository;
import com.example.backend.repository.PersonRepository;
import com.example.backend.repository.PromotionRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PromotionRequestService {

    @Autowired
    private PromotionRequestRepository promotionRequestRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    ModeratingActivityRepository moderatingActivityRepository;

    public List<PromotionRequestDTO> getAllRequests() {
        List<PromotionRequest> requests = promotionRequestRepository.findAll();

        return requests
                .stream()
                .map((request) -> {
                    PromotionRequestDTO dto = new PromotionRequestDTO();
                    dto.setEmail(request.getUser().getEmail());
                    dto.setName(request.getUser().getName());
                    return dto;
                })
                .toList();
    }

    public String promoteToOwner(String email, String token) {

        String moderatorEmail = jwtService.extractUsername(token);

        Person moderator = personRepository.findByEmail(moderatorEmail);

        if(moderator == null) {
            throw new UserNotFoundException("moderator not found");
        }

        if(!moderator.getRole().contains("moderator") && !moderator.getRole().contains("admin")) {
            throw new UnauthorizedActionException("not an admin or mod");
        }

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        user.setRole("owner");
        personRepository.save(user);

        PromotionRequest promotionRequest = null;

        for(PromotionRequest promotionRequest1 : promotionRequestRepository.findAll()) {
            if(promotionRequest1.getUser().getEmail().equals(user.getEmail())) {
                promotionRequest = promotionRequest1;
            }
        }

        if(promotionRequest != null) {
            promotionRequestRepository.delete(promotionRequest);
            promotionRequestRepository.flush();
        }

        ModeratingActivity moderatingActivity = new ModeratingActivity();
        moderatingActivity.setUser(user);
        moderatingActivity.setModerator(moderator);
        moderatingActivity.setDateTime(LocalDateTime.now());
        moderatingActivity.setNote("Promoted user to an owner.");

        moderatingActivityRepository.save(moderatingActivity);

        return "User successfully promoted to owner.";
    }

    public Map<String, Object> requestPromotion(String token) {

        String email = jwtService.extractUsername(token);

        Person user = personRepository.findByEmail(email);

        if(user == null) {
            throw new UserNotFoundException("User not found");
        }

        List<PromotionRequest> promotionRequests = promotionRequestRepository.findAll();

        for(PromotionRequest promotionRequest : promotionRequests) {
            if(promotionRequest.getUser().getEmail().equals(user.getEmail())) {
                throw new RequestAlreadySubmittedException("Request has already been submitted.");
            }
        }

        PromotionRequest promotionRequest = new PromotionRequest();
        promotionRequest.setUser(user);
        promotionRequestRepository.save(promotionRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "successfully requested");

        return response;
    }
}
