package com.example.demo.model;

public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private long expiration;
    private String tokenType;

    public AuthResponse() {}

    public AuthResponse(String accessToken, String refreshToken, long expiration, String tokenType) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiration = expiration;
        this.tokenType = tokenType;
    }

    // Getter và Setter (hoặc dùng Lombok: @Getter, @Setter)
    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public long getExpiration() {
        return expiration;
    }

    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
}
