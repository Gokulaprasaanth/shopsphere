package ecom.demo.service;

import ecom.demo.dto.LoginRequest;
import ecom.demo.dto.LoginResponse;
import ecom.demo.dto.RegisterRequest;
import ecom.demo.entity.RefreshToken;
import ecom.demo.entity.User;
import ecom.demo.enums.Role;
import ecom.demo.exception.BadRequestException;
import ecom.demo.exception.ResourceNotFoundException;
import ecom.demo.repository.UserRepository;
import ecom.demo.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private RefreshTokenService refreshTokenService;

    @InjectMocks
    private UserService userService;

    private User sampleUser;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setFullName("John Doe");
        sampleUser.setEmail("john@test.com");
        sampleUser.setPassword("encodedPassword");
        sampleUser.setRole(Role.USER);

        registerRequest = new RegisterRequest();
        registerRequest.setFullName("John Doe");
        registerRequest.setEmail("john@test.com");
        registerRequest.setPassword("password123");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("john@test.com");
        loginRequest.setPassword("password123");
    }

    @Test
    void testRegisterUser_Success() {
        // Arrange
        when(userRepository.existsByEmail("john@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        // Act
        User result = userService.register(registerRequest);

        // Assert
        assertNotNull(result);
        assertEquals("john@test.com", result.getEmail());
        assertEquals("encodedPassword", result.getPassword());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUser_EmailExists() {
        // Arrange
        when(userRepository.existsByEmail("john@test.com")).thenReturn(true);

        // Act & Assert
        assertThrows(BadRequestException.class, () -> userService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLoginUser_Success() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null); // Return value doesn't matter for this mock
        when(userRepository.findByEmail("john@test.com")).thenReturn(Optional.of(sampleUser));
        when(jwtService.generateToken("john@test.com", "USER")).thenReturn("jwtToken123");
        
        when(refreshTokenService.deleteByUserId(1L)).thenReturn(1);
        RefreshToken mockRefreshToken = new RefreshToken();
        mockRefreshToken.setToken("refresh123");
        when(refreshTokenService.createRefreshToken(1L)).thenReturn(mockRefreshToken);

        // Act
        LoginResponse response = userService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("jwtToken123", response.getToken());
        assertEquals("refresh123", response.getRefreshToken());
        assertEquals("john@test.com", response.getEmail());
    }

    @Test
    void testGetCurrentUser_Success() {
        // Arrange
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(authentication.getName()).thenReturn("john@test.com");
        when(userRepository.findByEmail("john@test.com")).thenReturn(Optional.of(sampleUser));

        // Act
        User result = userService.getCurrentUser();

        // Assert
        assertNotNull(result);
        assertEquals("john@test.com", result.getEmail());
    }

    @Test
    void testGetCurrentUser_NotFound() {
        // Arrange
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(authentication.getName()).thenReturn("unknown@test.com");
        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> userService.getCurrentUser());
    }
}
