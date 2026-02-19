package com.supcom.projetuniversitaire.model;

import java.time.LocalDate;
import java.util.UUID;

/**
 * ============================================================
 * MODÈLE : Tache
 * ============================================================
 * Représente une tâche au sein d'un projet universitaire.
 * Ce modèle est EMBARQUÉ dans le document Projet (pas de collection séparée).
 * Chaque tâche possède un statut Kanban : TO_DO, DOING, DONE
 * et une priorité : FAIBLE, MOYENNE, ÉLEVÉE.
 * ============================================================
 */
public class Tache {

    // --- Identifiant unique de la tâche (UUID généré automatiquement) ---
    private String id;

    // --- Titre court de la tâche ---
    private String titre;

    // --- Description détaillée de ce qu'il faut faire ---
    private String description;

    // --- Membre du groupe assigné à cette tâche ---
    private String assigneA;

    // --- Statut Kanban : "TO_DO", "DOING", "DONE" ---
    private String statut;

    // --- Priorité de la tâche : "FAIBLE", "MOYENNE", "ÉLEVÉE" ---
    private String priorite;

    // --- Date limite de la tâche ---
    private LocalDate dateLimite;

    // --- Indicateur de retard : true si la tâche dépasse sa date limite ---
    private boolean enRetard;

    // ============================================================
    // CONSTRUCTEURS
    // ============================================================

    /** Constructeur vide requis pour la désérialisation JSON */
    public Tache() {
        // Générer un identifiant unique pour chaque nouvelle tâche
        this.id = UUID.randomUUID().toString();
        this.statut = "TO_DO";   // Statut initial : à faire
        this.priorite = "MOYENNE"; // Priorité par défaut
        this.enRetard = false;
    }

    /** Constructeur avec les champs principaux */
    public Tache(String titre, String description, String assigneA, String priorite, LocalDate dateLimite) {
        this(); // Initialisation des valeurs par défaut
        this.titre = titre;
        this.description = description;
        this.assigneA = assigneA;
        this.priorite = priorite;
        this.dateLimite = dateLimite;
    }

    // ============================================================
    // MÉTHODE MÉTIER : Vérification automatique du retard
    // ============================================================

    /**
     * Vérifie si la tâche est en retard.
     * Une tâche est en retard si :
     *   - Elle n'est pas terminée (statut != "DONE")
     *   - La date limite est dépassée (avant aujourd'hui)
     *
     * Met à jour automatiquement le champ enRetard.
     */
    public void verifierRetard() {
        if (dateLimite != null && !"DONE".equals(this.statut)) {
            this.enRetard = LocalDate.now().isAfter(dateLimite);
        } else {
            // Si la tâche est terminée, elle n'est jamais "en retard"
            this.enRetard = false;
        }
    }

    // ============================================================
    // GETTERS ET SETTERS
    // ============================================================

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAssigneA() { return assigneA; }
    public void setAssigneA(String assigneA) { this.assigneA = assigneA; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getPriorite() { return priorite; }
    public void setPriorite(String priorite) { this.priorite = priorite; }

    public LocalDate getDateLimite() { return dateLimite; }
    public void setDateLimite(LocalDate dateLimite) { this.dateLimite = dateLimite; }

    public boolean isEnRetard() { return enRetard; }
    public void setEnRetard(boolean enRetard) { this.enRetard = enRetard; }

    @Override
    public String toString() {
        return "Tache{id='" + id + "', titre='" + titre + "', statut='" + statut +
               "', priorite='" + priorite + "', enRetard=" + enRetard + "}";
    }
}
