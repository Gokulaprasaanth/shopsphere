package ecom.demo.controller;

import ecom.demo.dto.LoginRequest;
import ecom.demo.dto.LoginResponse;
import ecom.demo.dto.RegisterRequest;
import ecom.demo.dto.TokenRefreshRequest;
import ecom.demo.dto.TokenRefreshResponse;
import ecom.demo.entity.RefreshToken;
import ecom.demo.entity.User;
import ecom.demo.service.RefreshTokenService;
import ecom.demo.service.UserService;
import ecom.demo.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    public AuthController(UserService userService, 
                          RefreshTokenService refreshTokenService,
                          JwtService jwtService) {
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
        this.jwtService = jwtService;
    }

    // ==========================
    // User Register
    // ==========================
    @PostMapping("/auth/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest request) {

        return new ResponseEntity<>(userService.register(request), HttpStatus.CREATED);
    }

    // ==========================
    // User Login
    // ==========================
    @PostMapping("/auth/login")
    public LoginResponse userLogin(@Valid @RequestBody LoginRequest request) {

        return userService.login(request);
    }

    // ==========================
    // Admin Login
    // ==========================
    @PostMapping("/admin/login")
    public LoginResponse adminLogin(@Valid @RequestBody LoginRequest request) {

        return userService.adminLogin(request);
    }

    // ==========================
    // Refresh Token
    // ==========================
    @PostMapping("/auth/refresh")
    public TokenRefreshResponse refreshtoken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
                    return new TokenRefreshResponse(token, requestRefreshToken);
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }
}