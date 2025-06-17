package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class EditUserDto {
    @NotBlank(message = "{email.notblank}")
    @Email(message = "{email.invalid}")
    private String email;

    @NotBlank(message = "{fullname.notblank}")
    private String fullname;

    private String address;
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "user.phonenumber.invalid")
    private String phonenumber;

    public EditUserDto(String email, String fullname, String address, String phonenumber) {
        this.email = email;
        this.fullname = fullname;
        this.address = address;
        this.phonenumber = phonenumber;
    }

    public EditUserDto() {
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }
}
