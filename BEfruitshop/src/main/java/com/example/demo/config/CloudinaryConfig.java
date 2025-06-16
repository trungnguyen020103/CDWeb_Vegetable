package com.example.demo.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dfryedaps",
                "api_key", "949669344827952",
                "api_secret", "oD5t79PEjWU89xuEBy4gQhOXrkE",
                "secure", true
        ));
    }
}
