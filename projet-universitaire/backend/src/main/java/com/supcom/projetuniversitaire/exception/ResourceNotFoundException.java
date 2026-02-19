package com.supcom.projetuniversitaire.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * ============================================================
 * EXCEPTION : ResourceNotFoundException
 * ============================================================
 * Exception levée lorsqu'une ressource (projet ou tâche) n'est pas trouvée.
 * @ResponseStatus(HttpStatus.NOT_FOUND) fait retourner automatiquement
 * un code HTTP 404 lorsque cette exception est levée.
 * ============================================================
 */
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    /**
     * Constructeur avec message d'erreur personnalisé.
     *
     * @param message description de la ressource non trouvée
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
