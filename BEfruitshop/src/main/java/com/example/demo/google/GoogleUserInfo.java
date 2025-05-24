package com.example.demo.google;

public class GoogleUserInfo {
    private String email;
    private String name;
    private String picture;

    public GoogleUserInfo(String email, String name, String picture) {
        this.email = email;
        this.name = name;
        this.picture = picture;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getPicture() {
        return picture;
    }


}
