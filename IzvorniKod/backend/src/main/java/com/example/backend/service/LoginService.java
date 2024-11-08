package com.example.backend.service;

import com.example.backend.exception.InvalidLoginException;
import com.example.backend.model.LoginInfo;
import com.example.backend.model.Moderator;
import com.example.backend.model.ShopOwner;
import com.example.backend.model.ShopUser;
import com.example.backend.repository.ModeratorRepository;
import com.example.backend.repository.ShopOwnerRepository;
import com.example.backend.repository.ShopUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.Map;

@Service
public class LoginService {

    @Autowired
    private UserService userService;

    @Autowired
    private ShopOwnerService shopOwnerService;

    @Autowired
    private ModeratorService moderatorService;

    private final PasswordEncoder passwordEncoder;

    public LoginService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<Map<String, String>> login(LoginInfo loginInfo) {

        Map<String, Object> response = new HashMap<>();

        String email = loginInfo.getEmail();
        String pass = loginInfo.getPass();

        ShopUser foundUser = userService.findUser(email);

        if (foundUser != null) {
            if (passwordEncoder.matches(pass, foundUser.getPass())) {
                response.put("message", "Login successful");
                return ResponseEntity.ok(Map.of("redirectUrl", "/userhome"));
            }
        } else {
            ShopOwner foundOwner = shopOwnerService.findShopOwner(email);
            if (foundOwner != null) {
                if (passwordEncoder.matches(pass, foundOwner.getPass())) {
                    response.put("message", "Login successful");
                    return ResponseEntity.ok(Map.of("redirectUrl", "/ownerhome"));
                }
            } else {
                Moderator foundModerator = moderatorService.findModerator(email);
                if (foundModerator != null) {
                    if (passwordEncoder.matches(pass, foundModerator.getPass())) {
                        response.put("message", "Login successful");
                        return ResponseEntity.ok(Map.of("redirectUrl", "/moderatorhome"));
                    }
                }
            }

        }

        throw new InvalidLoginException("Invalid login credentials");
    }
}
