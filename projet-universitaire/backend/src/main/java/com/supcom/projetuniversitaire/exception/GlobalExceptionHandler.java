package com.supcom.projetuniversitaire.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * ============================================================
 * GESTIONNAIRE GLOBAL D'EXCEPTIONS : GlobalExceptionHandler
 * ============================================================
 * Intercepte toutes les exceptions levées par les controllers
 * et retourne une réponse JSON formatée avec le code HTTP approprié.
 *
 * @RestControllerAdvice s'applique à tous les controllers de l'application.
 * ============================================================
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Gère les exceptions "ressource non trouvée" (404).
     * Retourne un JSON structuré avec le message d'erreur.
     *
     * @param ex l'exception levée
     * @return réponse HTTP 404 avec détails de l'erreur
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(ResourceNotFoundException ex) {
        // Construire le corps de la réponse d'erreur
        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("timestamp", LocalDateTime.now().toString());
        errorBody.put("status", HttpStatus.NOT_FOUND.value());
        errorBody.put("erreur", "Ressource non trouvée");
        errorBody.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody);
    }

    /**
     * Gère toutes les autres exceptions non prévues (500).
     *
     * @param ex l'exception non gérée
     * @return réponse HTTP 500 avec message générique
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("timestamp", LocalDateTime.now().toString());
        errorBody.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorBody.put("erreur", "Erreur interne du serveur");
        errorBody.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorBody);
    }
}
