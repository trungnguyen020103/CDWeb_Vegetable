package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String password;
    private String email;
    private String fullname;
    private String address;
    private String phonenumber;
    private Integer role;
    private String language; // Thêm trường language

    public User() {}

    public User(Integer id, String password, String email, String fullname, String address, String phonenumber, Integer role, String language) {
        this.id = id;
        this.password = password;
        this.email = email;
        this.fullname = fullname;
        this.address = address;
        this.phonenumber = phonenumber;
        this.role = role;
        this.language = language;
    }
}