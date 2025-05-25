package com.example.demo.sendmail;

import java.util.Locale;

public interface EmailService {
    String sendSimpleMail(EmailDetails details, Locale locale);
    boolean checkCode(String code, String email);
}