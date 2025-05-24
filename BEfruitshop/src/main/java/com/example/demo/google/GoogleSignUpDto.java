package com.example.demo.google;


public class GoogleSignUpDto {
    private String email;
    private String fullname;

    public GoogleSignUpDto() {}

    public GoogleSignUpDto(String email, String fullname) {
        this.email = email;
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }


}
