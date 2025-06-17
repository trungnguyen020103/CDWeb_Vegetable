package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateUserDto {
    private Long id;

    @NotBlank(message = "user.fullname.required")
    @Size(min = 2, max = 255, message = "user.fullname.length")
    private String fullname;

    @Size(max = 255, message = "user.address.length")
    private String address;

    @Pattern(regexp = "^(0[3|5|7|8|9])[0-9]{8}$", message = "user.phonenumber.invalid")
    private String phonenumber;


    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
