package com.example.demo.sendmail;

import com.example.demo.model.EmailVerifycation;
import com.example.demo.service.EmailVerifycationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Random;

@Service
public class EmailServiceImpl implements EmailService {
    @Autowired
    EmailVerifycationService emailVerifycationService;
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private MessageSource messageSource;

    @Value("${spring.mail.username}")
    private String sender;

    public String sendSimpleMail(EmailDetails details, Locale locale) {
        try {
            emailVerifycationService.deleteExpiredVerifications();
            String code = generateRandomHash();
            details.setMsgBody(code);
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(sender);
            mailMessage.setTo(details.getRecipient());
            mailMessage.setText(messageSource.getMessage("email_verification_code", new Object[]{code}, locale));
            mailMessage.setSubject(messageSource.getMessage("email_verification_subject", null, locale));
            EmailVerifycation emailVerifycation = new EmailVerifycation();
            emailVerifycation.setEmail(details.getRecipient());
            emailVerifycation.setCode(code);
            emailVerifycation.setTimeExpire(LocalDateTime.now().plusMinutes(10));
            emailVerifycationService.createVerification(emailVerifycation);
            javaMailSender.send(mailMessage);
            return "Mail Sent Successfully...";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error while Sending Mail: " + e.getMessage();
        }
    }

    @Override
    public boolean checkCode(String code, String email) {
        return false;
    }

    public static String generateRandomHash() {
        Random random = new Random();
        StringBuilder hash = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            int digit = random.nextInt(10);
            hash.append(digit);
        }
        return hash.toString();
    }
}