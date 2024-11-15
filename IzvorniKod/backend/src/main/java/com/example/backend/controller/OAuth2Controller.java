package com.example.backend.controller;

import com.example.backend.service.OAuth2Service;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@RestController
public class OAuth2Controller {

    @Autowired
    private OAuth2Service oAuth2Service;

    @GetMapping("/oauth2/callback")
    public RedirectView handleOAuth2Callback(@RequestParam("code") String code) throws JsonProcessingException {
        return oAuth2Service.handleOAuth2Callback(code);
    }

}
