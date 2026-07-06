package ecom.demo.dto;

public class LoginResponse {

    private String token;
    private String message;
    private String role;
    private String email;
    private String fullName;
    private String refreshToken;

    public LoginResponse() {
    }

    public LoginResponse(String token, String message,
                         String role, String email, String fullName, String refreshToken) {

        this.token = token;
        this.message = message;
        this.role = role;
        this.email = email;
        this.fullName = fullName;
        this.refreshToken = refreshToken;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}