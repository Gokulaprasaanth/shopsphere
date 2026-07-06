package ecom.demo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {

    private LocalDateTime timestamp;

    private int status;

    private String error;

    private String message;

    private Map<String, String> errors;

    public ApiErrorResponse() {
    }

    // ==========================
    // Normal Errors
    // ==========================
    public ApiErrorResponse(LocalDateTime timestamp,
                            int status,
                            String error,
                            String message) {

        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
    }

    // ==========================
    // Validation Errors
    // ==========================
    public ApiErrorResponse(LocalDateTime timestamp,
                            int status,
                            String error,
                            Map<String, String> errors) {

        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.errors = errors;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    public void setErrors(Map<String, String> errors) {
        this.errors = errors;
    }
}