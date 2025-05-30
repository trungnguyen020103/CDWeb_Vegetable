package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class I18nService {

    @Autowired
    private MessageSource messageSource;

    public String getMessage(String code, Object[] args, Locale locale) {
        return messageSource.getMessage(code, args, locale);
    }

    public String getMessage(String code, Locale locale) {
        return getMessage(code, null, locale);
    }
}