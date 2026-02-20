package com.supcom.projetuniversitaire.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * ============================================================
 * CONFIGURATION : CORS (Cross-Origin Resource Sharing)
 * ============================================================
 * Configure les en-têtes CORS pour autoriser les requêtes
 * du frontend depuis différentes origines (local, Cloudflare Pages, etc.)
 * ============================================================
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // Autoriser les requêtes de localhost en développement
                .allowedOrigins(
                    "http://localhost:3000",
                    "http://localhost:4200",
                    "http://localhost:5173",
                    "https://projetuni.tarek-azabou.workers.dev",
                    "https://projetuni-production.pages.dev",
                    "https://*.pages.dev",
                    "https://*.workers.dev"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600); // Cache preflight requests for 1 hour
    }
}
