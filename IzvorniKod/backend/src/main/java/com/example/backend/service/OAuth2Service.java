package com.example.backend.service;

import com.example.backend.model.Person;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
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
    private PersonService personService;

    private String access_token;

    public RedirectView handleOAuth2Callback(String code) throws JsonProcessingException {
        SecurityContextHolder.getContext().setAuthentication(createAuthenticationFromCode(code));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        String jwtToken = jwtService.generateToken(email);

        Person user = personService.findUser(email);

        if(user == null) {
            user = new Person();
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setRole("user");
            user.setGoogleAccessToken(access_token);
            personService.save(user);
        } else {
            user.setGoogleAccessToken(access_token);
            personService.save(user);
        }

        return new RedirectView("http://" + web_url + "/userhome?token=" + jwtToken + "&role=" + user.getRole());
    }

    public OAuth2AuthenticationToken createAuthenticationFromCode(String code) {
        String accessToken = exchangeCodeForToken(code);

        access_token = accessToken;

        Map<String, Object> userAttributes = fetchUserDetailsWithAccessToken(accessToken).getAttributes();

        firstName = (String) userAttributes.get("given_name");
        lastName = (String) userAttributes.get("family_name");

        OAuth2User oAuth2User = fetchUserDetailsWithAccessToken(accessToken);

        List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("user");
        return new OAuth2AuthenticationToken(oAuth2User, authorities, "828869351024-4b3mefodfksotddch8mkiha71t2tn83j.apps.googleusercontent.com");
    }


    public String exchangeCodeForToken(String code) {
        WebClient webClient = WebClient.create();

        // OAuth2 token request parameters
        return webClient.post()
                .uri("https://oauth2.googleapis.com/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("grant_type", "authorization_code")
                        .with("code", code)
                        .with("redirect_uri", "http://" + web_url + ":8080/oauth2/callback")  // Ensure this matches provider config
                        .with("client_id", "828869351024-4b3mefodfksotddch8mkiha71t2tn83j.apps.googleusercontent.com")
                        .with("client_secret", "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"))
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> (String) response.get("access_token"))
                .block();
    }

    public DefaultOAuth2User fetchUserDetailsWithAccessToken(String accessToken) {
        WebClient webClient = WebClient.create();

        Map<String, Object> userAttributes = webClient.get()
                .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return new DefaultOAuth2User(
                AuthorityUtils.createAuthorityList("ROLE_USER"),
                userAttributes,
                "email"
        );

    }

    @Bean
    public WebClient webClient() {
        return WebClient.builder().build();
    }
}
