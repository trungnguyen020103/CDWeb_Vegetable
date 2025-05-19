package com.example.demo.sendmail;

public interface EmailService {

    String sendSimpleMail(EmailDetails details);
    boolean checkCode(String code,String email);

}
