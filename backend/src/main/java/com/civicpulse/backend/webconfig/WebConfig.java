package com.civicpulse.backend.webconfig;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }

            // ⭐ FIXED: ORDER MATTERS — specific handler FIRST
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {

                // 1️⃣ FIRST serve resolved images
                registry.addResourceHandler("/uploads/resolved/**")
                        .addResourceLocations("file:uploads/resolved/");

                // 2️⃣ THEN serve normal images
                registry.addResourceHandler("/uploads/**")
                        .addResourceLocations("file:uploads/");
            }
        };
    }
}
