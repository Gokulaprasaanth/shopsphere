package ecom.demo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationMs}")
    private long jwtExpirationMs;

    private SecretKey key;

    @jakarta.annotation.PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // ==========================
    // Generate JWT Token
    // ==========================
    public String generateToken(String email, String role) {

        Map<String, Object> claims = new HashMap<>();

        claims.put("role", role);

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key)
                .compact();
    }

    // ==========================
    // Extract Email
    // ==========================
    public String extractEmail(String token) {

        return extractAllClaims(token).getSubject();
    }

    // ==========================
    // Extract Role
    // ==========================
    public String extractRole(String token) {

        return extractAllClaims(token).get("role", String.class);
    }

    // ==========================
    // Extract Claims
    // ==========================
    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // ==========================
    // Validate Token
    // ==========================
    public boolean isTokenValid(String token, String email) {

        return extractEmail(token).equals(email)
                && !isTokenExpired(token);
    }

    // ==========================
    // Check Expiry
    // ==========================
    private boolean isTokenExpired(String token) {

        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }
}