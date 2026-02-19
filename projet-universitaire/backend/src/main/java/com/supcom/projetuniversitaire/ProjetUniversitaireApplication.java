package com.supcom.projetuniversitaire;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ============================================================
 * CLASSE PRINCIPALE - POINT D'ENTRÉE DE L'APPLICATION
 * ============================================================
 * Cette classe lance le serveur Spring Boot.
 * @SpringBootApplication active :
 *   - La configuration automatique (AutoConfiguration)
 *   - Le scan des composants (ComponentScan)
 *   - La configuration Spring (SpringConfiguration)
 * ============================================================
 */
@SpringBootApplication
public class ProjetUniversitaireApplication {

    /**
     * Méthode main : point d'entrée Java
     * Lance l'application Spring Boot avec le contexte complet
     *
     * @param args arguments de ligne de commande (non utilisés ici)
     */
    public static void main(String[] args) {
        SpringApplication.run(ProjetUniversitaireApplication.class, args);
        System.out.println("==============================================");
        System.out.println("  Plateforme Gestion Projets Universitaires  ");
        System.out.println("  SUP'COM 2025-2026 - Serveur démarré !       ");
        System.out.println("  API disponible sur : http://localhost:8080   ");
        System.out.println("==============================================");
    }
}
