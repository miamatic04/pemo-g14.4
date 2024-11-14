package com.example.backend.service;

import com.example.backend.model.ShopUser;
import com.example.backend.repository.ShopUserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.AfterDomainEventPublication;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.view.RedirectView;

import java.util.List;
import java.util.Map;

@Service
public class OAuth2Service {

    private String firstName;
    private String lastName;

    @Value("${spring.boot.web.url}")
    private String web_url;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private ShopUserService shopUserService;

    public RedirectView handleOAuth2Callback(String code) throws JsonProcessingException {
        SecurityContextHolder.getContext().setAuthentication(createAuthenticationFromCode(code));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        String jwtToken = jwtService.generateToken(email);

        ShopUser user = shopUserService.findUser(email);

        if(user == null) {
            user = new ShopUser();
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setRole("user");
            shopUserService.saveUser(user);
        }

        return new RedirectView("http://" + web_url + ":3000/userhome?token=" + jwtToken + "&role=" + user.getRole());
    }

    public OAuth2AuthenticationToken createAuthenticationFromCode(String code) {
        // Step 1: Exchange the code for an access token
        String accessToken = exchangeCodeForToken(code);

        Map<String, Object> userAttributes = fetchUserDetailsWithAccessToken(accessToken).getAttributes();

        firstName = (String) userAttributes.get("given_name");
        lastName = (String) userAttributes.get("family_name");

        // Step 2: Fetch the user details using the access token
        OAuth2User oAuth2User = fetchUserDetailsWithAccessToken(accessToken);

        // Step 3: Create an OAuth2AuthenticationToken with the OAuth2 user and authorities
        List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("user");
        return new OAuth2AuthenticationToken(oAuth2User, authorities, "128191605968-jg0b3nos05aieno3lel20kli5f8eobr7.apps.googleusercontent.com");
    }


    public String exchangeCodeForToken(String code) {
        WebClient webClient = WebClient.create();

        // OAuth2 token request parameters
        return webClient.post()
                .uri("https://oauth2.googleapis.com/token")  // Replace with the actual token URL
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("grant_type", "authorization_code")
                        .with("code", code)
                        .with("redirect_uri", "http://" + web_url + ":8080/oauth2/callback")  // Ensure this matches provider config
                        .with("client_id", "128191605968-jg0b3nos05aieno3lel20kli5f8eobr7.apps.googleusercontent.com")
                        .with("client_secret", "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"))
                .retrieve()
                .bodyToMono(Map.class)  // Parse response as Map to extract the token
                .map(response -> (String) response.get("access_token"))
                .block();
    }

    public DefaultOAuth2User fetchUserDetailsWithAccessToken(String accessToken) {
        WebClient webClient = WebClient.create();

        Map<String, Object> userAttributes = webClient.get()
                .uri("https://www.googleapis.com/oauth2/v3/userinfo")  // User info endpoint URL
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return new DefaultOAuth2User(
                AuthorityUtils.createAuthorityList("ROLE_USER"),
                userAttributes,
                "email"  // Replace with the appropriate principal attribute from user info
        );

    }

    @Bean
    public WebClient webClient() {
        return WebClient.builder().build();
    }
}
