package com.example.backend;
import com.example.backend.exception.EmailNotConfirmedException;
import com.example.backend.exception.InvalidLoginException;
import com.example.backend.model.*;
import com.example.backend.repository.PersonRepository;
import com.example.backend.repository.UserActivityRepository;
import com.example.backend.service.JWTService;
import com.example.backend.service.LoginService;
import com.example.backend.service.OrderService;
import com.example.backend.service.PersonService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LoginServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JWTService jwtService;

    @Mock
    private PersonService personService;

    @Mock
    private OrderService orderService;

    @Mock
    private PersonRepository personRepository;

    @Mock
    private UserActivityRepository userActivityRepository;

    @InjectMocks
    private LoginService loginService;

    private LoginInfo loginInfo;
    private Person person;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        loginInfo = new LoginInfo("ante.covic@gmail.com", "sifra");
        person = new Person();
        person.setEmail("ante.covic@gmail.com");
        person.setEmailConfirmed(true);
    }

    @Test
    void loginUser_shouldReturnResponseOk() throws JsonProcessingException {

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);


        when(personService.findUser(loginInfo.getEmail())).thenReturn(person);

        when(personRepository.findByEmail(loginInfo.getEmail())).thenReturn(person);


        String generatedToken = "jwtToken";
        when(jwtService.generateToken(loginInfo.getEmail())).thenReturn(generatedToken);


        OrderDTO activeOrderDTO = new OrderDTO((long) 10000, (long) 12345, "konzum", "/image/path", null,
                0.0, true,  false, true, LocalDate.of(2025, 1, 1));
        when(orderService.getActiveOrder(generatedToken)).thenReturn(activeOrderDTO);


        UserActivity userActivity = new UserActivity();
        when(userActivityRepository.save(any(UserActivity.class))).thenReturn(userActivity);


        ResponseEntity<Map<String, Object>> response = loginService.login(loginInfo);


        assertEquals(200, response.getStatusCodeValue());
        Map<String, Object> responseBody = response.getBody();
        assertNotNull(responseBody);
        assertEquals(generatedToken, responseBody.get("token"));
        assertTrue(responseBody.containsKey("role"));
        assertTrue(responseBody.containsKey("activeOrderId"));
        assertNotNull(responseBody.get("role"));
        assertNotNull(responseBody.get("activeOrderId"));


        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(personService, times(1)).findUser(loginInfo.getEmail());
        verify(jwtService, times(1)).generateToken(loginInfo.getEmail());
        verify(orderService, times(1)).getActiveOrder(generatedToken);
        verify(userActivityRepository, times(1)).save(any(UserActivity.class));
    }

    @Test
    void loginUser_noActiveOrders_shouldReturnResponseOk() throws JsonProcessingException {

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);


        when(personService.findUser(loginInfo.getEmail())).thenReturn(person);

        when(personRepository.findByEmail(loginInfo.getEmail())).thenReturn(person);


        String generatedToken = "jwtToken";
        when(jwtService.generateToken(loginInfo.getEmail())).thenReturn(generatedToken);


        OrderDTO noActiveOrdersRepresentation = new OrderDTO();
        noActiveOrdersRepresentation.setId(null);
        when(orderService.getActiveOrder(generatedToken)).thenReturn(noActiveOrdersRepresentation);


        UserActivity userActivity = new UserActivity();
        when(userActivityRepository.save(any(UserActivity.class))).thenReturn(userActivity);


        ResponseEntity<Map<String, Object>> response = loginService.login(loginInfo);


        assertEquals(200, response.getStatusCodeValue());
        Map<String, Object> responseBody = response.getBody();
        assertNotNull(responseBody);
        assertEquals(generatedToken, responseBody.get("token"));
        assertTrue(responseBody.containsKey("role"));
        assertTrue(responseBody.containsKey("activeOrderId"));
        assertNotNull(responseBody.get("role"));
        assertNull(responseBody.get("activeOrderId"));


        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(personService, times(1)).findUser(loginInfo.getEmail());
        verify(jwtService, times(1)).generateToken(loginInfo.getEmail());
        verify(orderService, times(1)).getActiveOrder(generatedToken);
        verify(userActivityRepository, times(1)).save(any(UserActivity.class));
    }


    @Test
    void loginUser_emailNotConfirmed_shouldThrowEmailNotConfirmedException() {

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);

        person.setEmailConfirmed(false);
        when(personService.findUser(loginInfo.getEmail())).thenReturn(person);


        assertThrows(EmailNotConfirmedException.class, () -> {
            loginService.login(loginInfo);
        });
    }

    @Test
    void loginUser_invalidInput_shouldThrowInvalidLoginException() {

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(false);


        assertThrows(InvalidLoginException.class, () -> {
            loginService.login(loginInfo);
        });
    }
}
