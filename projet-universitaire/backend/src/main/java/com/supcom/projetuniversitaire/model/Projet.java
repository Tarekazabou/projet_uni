package com.supcom.projetuniversitaire.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================
 * MODÈLE : Projet
 * ============================================================
 * Représente un projet universitaire dans la base de données.
 * @Document indique que cette classe correspond à une collection MongoDB.
 * Chaque instance = un document dans la collection "projets".
 * ============================================================
 */
@Document(collection = "projets")
public class Projet {

    // --- Identifiant unique généré automatiquement par MongoDB (ObjectId) ---
    @Id
    private String id;

    // --- Titre du projet (obligatoire) ---
    @NotBlank(message = "Le titre du projet est obligatoire")
    private String titre;

    // --- Description détaillée du projet ---
    private String description;

    // --- Matière / Module universitaire concerné ---
    private String matiere;

    // --- Date de création du projet ---
    private LocalDate dateCreation;

    // --- Date limite de rendu du projet ---
    private LocalDate dateLimite;

    // --- Liste des membres du groupe (emails ou noms) ---
    private List<String> membres = new ArrayList<>();

    // --- Liste des tâches associées au projet ---
    private List<Tache> taches = new ArrayList<>();

    // --- Pourcentage d'avancement calculé automatiquement (0 à 100) ---
    private double avancement;

    // --- Statut global du projet : EN_COURS, TERMINÉ, EN_RETARD ---
    private String statut;

    // ============================================================
    // CONSTRUCTEURS
    // ============================================================

    /** Constructeur vide requis par Spring Data MongoDB */
    public Projet() {
        this.dateCreation = LocalDate.now();
        this.statut = "EN_COURS";
        this.avancement = 0.0;
    }

    /** Constructeur avec les champs essentiels */
    public Projet(String titre, String description, String matiere, LocalDate dateLimite) {
        this(); // Appel du constructeur vide pour initialiser les valeurs par défaut
        this.titre = titre;
        this.description = description;
        this.matiere = matiere;
        this.dateLimite = dateLimite;
    }

    // ============================================================
    // MÉTHODE MÉTIER : Calcul automatique de l'avancement (%)
    // ============================================================

    /**
     * Calcule automatiquement le pourcentage d'avancement du projet.
     * Formule : (nombre de tâches "DONE" / total des tâches) * 100
     * Si aucune tâche, l'avancement est 0%.
     */
    public void calculerAvancement() {
        if (taches == null || taches.isEmpty()) {
            this.avancement = 0.0;
            return;
        }
        // Compter les tâches terminées
        long tachesTerminees = taches.stream()
                .filter(t -> "DONE".equals(t.getStatut()))
                .count();

        // Calcul du pourcentage
        this.avancement = ((double) tachesTerminees / taches.size()) * 100;
    }

    /**
     * Vérifie si le projet est en retard par rapport à la date limite.
     * Met à jour le statut si nécessaire.
     */
    public void verifierRetard() {
        if (dateLimite != null && LocalDate.now().isAfter(dateLimite) && avancement < 100) {
            this.statut = "EN_RETARD";
        } else if (avancement >= 100) {
            this.statut = "TERMINÉ";
        } else {
            this.statut = "EN_COURS";
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

    public String getMatiere() { return matiere; }
    public void setMatiere(String matiere) { this.matiere = matiere; }

    public LocalDate getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDate dateCreation) { this.dateCreation = dateCreation; }

    public LocalDate getDateLimite() { return dateLimite; }
    public void setDateLimite(LocalDate dateLimite) { this.dateLimite = dateLimite; }

    public List<String> getMembres() { return membres; }
    public void setMembres(List<String> membres) { this.membres = membres; }

    public List<Tache> getTaches() { return taches; }
    public void setTaches(List<Tache> taches) { this.taches = taches; }

    public double getAvancement() { return avancement; }
    public void setAvancement(double avancement) { this.avancement = avancement; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    @Override
    public String toString() {
        return "Projet{id='" + id + "', titre='" + titre + "', avancement=" + avancement + "%, statut='" + statut + "'}";
    }
}
