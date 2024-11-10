package com.example.backend.service;

import com.example.backend.exception.InvalidLoginException;
import com.example.backend.model.LoginInfo;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashMap;
import java.util.Map;

@Service
public class LoginService {

    @Autowired
    private ShopUserService shopUserService;

    @Autowired
    private ShopOwnerService shopOwnerService;

    @Autowired
    private ModeratorService moderatorService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

    private final PasswordEncoder passwordEncoder;

    public LoginService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    /*public ResponseEntity<Map<String, String>> login(LoginInfo loginInfo) {

        Map<String, Object> response = new HashMap<>();

        String email = loginInfo.getEmail();
        String pass = loginInfo.getPass();

        System.out.println(email);
        System.out.println(pass);

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
    }*/

    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginInfo loginInfo) throws JsonProcessingException {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginInfo.getEmail(), loginInfo.getPass()));

        if(authentication.isAuthenticated()) {
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwtService.generateToken(loginInfo.getEmail()));
            response.put("role", authentication.getAuthorities().toString());

            return ResponseEntity.ok(response);
        }

        throw new InvalidLoginException("Invalid login credentials");
    }
}
