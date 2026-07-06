package ecom.demo.service;

import ecom.demo.dto.LoginRequest;
import ecom.demo.dto.LoginResponse;
import ecom.demo.dto.RegisterRequest;
import ecom.demo.entity.User;
import ecom.demo.enums.Role;
import ecom.demo.exception.BadRequestException;
import ecom.demo.exception.ResourceNotFoundException;
import ecom.demo.repository.UserRepository;
import ecom.demo.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       RefreshTokenService refreshTokenService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    // ==========================
    // Register User
    // ==========================
    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        // Encrypt Password
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // Default Role
        user.setRole(Role.USER);

        return userRepository.save(user);
    }

    // ==========================
    // User Login
    // ==========================
    public LoginResponse login(LoginRequest request) {

        User user = authenticate(request);

        return buildLoginResponse(user);
    }

    // ==========================
    // Admin Login
    // ==========================
    public LoginResponse adminLogin(LoginRequest request) {

        User user = authenticate(request);

        if (user.getRole() != Role.ADMIN) {
            throw new BadRequestException("Access Denied. Admin Only.");
        }

        return buildLoginResponse(user);
    }

    // ==========================
    // Authenticate User
    // ==========================
    private User authenticate(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        return userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    // ==========================
    // Build Login Response
    // ==========================
    private LoginResponse buildLoginResponse(User user) {

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        // Delete existing refresh tokens for the user and create a new one
        refreshTokenService.deleteByUserId(user.getId());
        String refreshToken = refreshTokenService.createRefreshToken(user.getId()).getToken();

        return new LoginResponse(
                token,
                "Login Successful",
                user.getRole().name(),
                user.getEmail(),
                user.getFullName(),
                refreshToken
        );
    }

    // ==========================
    // Get All Users
    // ==========================
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    // ==========================
    // Get Current Logged-in User
    // ==========================
    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }
}