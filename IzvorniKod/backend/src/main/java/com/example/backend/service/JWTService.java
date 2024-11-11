package com.example.backend.service;

import javax.crypto.KeyGenerator;
import javax.crypto.Mac;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.nimbusds.jose.util.Base64URL;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JWTService {

    private String secretKey = "";

    public JWTService() {

        try {
            KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
            SecretKey sk = keyGen.generateKey();
            this.secretKey = Base64.getEncoder().encodeToString(sk.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    // rucna kreacija jwt tokena zbog io.jsonwebtoken.lang.UnknownClassException: Unable to load class named [io.jsonwebtoken.impl.DefaultJwtBuilder]
    public String generateToken(String username) throws JsonProcessingException {
        // header: algoritam i tip
        Map<String, Object> header = new HashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");

        // payload: email, issuedAt, expiration
        long currentTimeMillis = System.currentTimeMillis();
        Date issuedAt = new Date(currentTimeMillis);
        Date expiration = new Date(currentTimeMillis + 60 * 60 * 30 * 1000); // 30 min

        Map<String, Object> payload = new HashMap<>();
        payload.put("iat", issuedAt.getTime() / 1000);
        payload.put("exp", expiration.getTime() / 1000);
        payload.put("sub", username);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonHeader = objectMapper.writeValueAsString(header);
        String jsonPayload = objectMapper.writeValueAsString(payload);

        // kodiranje headera i payloada
        String encodedHeader = Base64.getEncoder().encodeToString(jsonHeader.getBytes());
        String encodedPayload = Base64.getEncoder().encodeToString(jsonPayload.getBytes());

        encodedHeader = encodedHeader
                .replace('+', '-')
                .replace('/', '_')
                .replace("=", "");

        encodedPayload = encodedPayload
                .replace('+', '-')
                .replace('/', '_')
                .replace("=", "");

        // unsigned header.payload
        String unsignedJwt = encodedHeader + "." + encodedPayload;

        // signed jwt - trebalo bi generirati jaci key
        String signature = signJwt(unsignedJwt, getKey());

        // kombinirati header.payload.signature
        return unsignedJwt + "." + signature;
    }

    // hmacsha256 sign
    private String signJwt(String data, SecretKey key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(key);
            byte[] signedData = mac.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(signedData)
                    .replace('+', '-')
                    .replace('/', '_')
                    .replace("=", "");
        } catch (Exception e) {
            throw new RuntimeException("Error signing JWT", e);
        }
    }

    // generiranje kljuca za sign, treba bit jaci
    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        // extract the username from jwt token
        if(token != null && !token.equals("null"))
            return extractClaim(token, Claims::getSubject);
        else
            return null;
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extractUsername(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
