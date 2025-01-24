package com.example.backend;

import com.example.backend.exception.UserNotFoundException;
import com.example.backend.dto.LocationInfo;
import com.example.backend.model.Person;
import com.example.backend.service.JWTService;
import com.example.backend.service.LocationService;
import com.example.backend.service.PersonService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LocationServiceTest {

    @InjectMocks
    private LocationService locationService;

    @Mock
    private PersonService personService;

    @Mock
    private JWTService jwtService;

    private String validToken;
    private String email;
    private LocationInfo locationInfo;
    private Person user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        validToken = "mockToken";
        email = "ante.covic@gmail.com";

        locationInfo = new LocationInfo();
        locationInfo.setLongitude(17.5);
        locationInfo.setLatitude(42.0);

        user = new Person();
        user.setEmail(email);
        user.setLongitude(0.0);
        user.setLatitude(0.0);

        when(jwtService.extractUsername(validToken)).thenReturn(email);

        when(personService.findUser(email)).thenReturn(user);
    }

    @Test
    void updateLocation_shouldReturnResponseOk() {

        ResponseEntity<Map<String, Object>> response = locationService.updateLocation(locationInfo, validToken);


        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().containsKey("message"));
        assertEquals("Location successfully updated.", response.getBody().get("message"));


        verify(personService, times(1)).findUser(email);
        verify(personService, times(1)).save(user);

        assertEquals(locationInfo.getLongitude(), user.getLongitude());
        assertEquals(locationInfo.getLatitude(), user.getLatitude());
    }

    @Test
    void updateLocation_invalidUser_shouldThrowUserNotFoundException() {
        when(personService.findUser(email)).thenReturn(null);

        assertThrows(UserNotFoundException.class, () -> locationService.updateLocation(locationInfo, validToken));

        verify(personService, times(1)).findUser(email);
        verify(personService, times(0)).save(any(Person.class));
    }
}
