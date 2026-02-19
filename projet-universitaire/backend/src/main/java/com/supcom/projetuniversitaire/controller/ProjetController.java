package com.supcom.projetuniversitaire.controller;

import com.supcom.projetuniversitaire.model.Projet;
import com.supcom.projetuniversitaire.model.Tache;
import com.supcom.projetuniversitaire.service.ProjetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * ============================================================
 * CONTROLLER REST : ProjetController
 * ============================================================
 * Expose les APIs REST pour la gestion des projets universitaires.
 *
 * CORS configuré globalement dans WebConfig pour supporter local et production
 * @RestController : indique que cette classe est un contrôleur REST
 * @RequestMapping : préfixe de toutes les routes → /api/projets
 *
 * Routes disponibles :
 *   GET    /api/projets           → liste tous les projets
 *   GET    /api/projets/{id}      → récupère un projet par ID
 *   POST   /api/projets           → crée un nouveau projet
 *   PUT    /api/projets/{id}      → met à jour un projet
 *   DELETE /api/projets/{id}      → supprime un projet
 *   POST   /api/projets/{id}/taches              → ajoute une tâche
 *   PUT    /api/projets/{id}/taches/{tacheId}    → met à jour le statut d'une tâche
 *   DELETE /api/projets/{id}/taches/{tacheId}    → supprime une tâche
 *   POST   /api/projets/{id}/membres             → ajoute un membre
 * ============================================================
 */
@RestController
@RequestMapping("/api/projets")
public class ProjetController {

    // Injection du service métier
    @Autowired
    private ProjetService projetService;

    // ============================================================
    // ENDPOINTS PROJETS - CRUD COMPLET
    // ============================================================

    /**
     * GET /api/projets
     * Récupère la liste complète de tous les projets.
     * Retourne HTTP 200 (OK) avec la liste JSON.
     */
    @GetMapping
    public ResponseEntity<List<Projet>> getTousLesProjets() {
        List<Projet> projets = projetService.getTousLesProjets();
        return ResponseEntity.ok(projets);
    }

    /**
     * GET /api/projets/{id}
     * Récupère un projet spécifique par son identifiant MongoDB.
     * Retourne HTTP 200 si trouvé, HTTP 404 si non trouvé.
     *
     * @param id l'identifiant MongoDB du projet (PathVariable)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Projet> getProjetParId(@PathVariable String id) {
        Projet projet = projetService.getProjetParId(id);
        return ResponseEntity.ok(projet);
    }

    /**
     * POST /api/projets
     * Crée un nouveau projet universitaire.
     * Retourne HTTP 201 (Created) avec le projet créé.
     *
     * @param projet les données du nouveau projet (RequestBody JSON)
     */
    @PostMapping
    public ResponseEntity<Projet> creerProjet(@Valid @RequestBody Projet projet) {
        Projet nouveauProjet = projetService.creerProjet(projet);
        return ResponseEntity.status(HttpStatus.CREATED).body(nouveauProjet);
    }

    /**
     * PUT /api/projets/{id}
     * Met à jour un projet existant.
     * Retourne HTTP 200 avec le projet mis à jour.
     *
     * @param id            l'identifiant du projet à modifier
     * @param projetDetails les nouvelles données (RequestBody JSON)
     */
    @PutMapping("/{id}")
    public ResponseEntity<Projet> mettreAJourProjet(
            @PathVariable String id,
            @Valid @RequestBody Projet projetDetails) {
        Projet projetMisAJour = projetService.mettreAJourProjet(id, projetDetails);
        return ResponseEntity.ok(projetMisAJour);
    }

    /**
     * DELETE /api/projets/{id}
     * Supprime un projet par son identifiant.
     * Retourne HTTP 200 avec un message de confirmation.
     *
     * @param id l'identifiant du projet à supprimer
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> supprimerProjet(@PathVariable String id) {
        projetService.supprimerProjet(id);
        // Retourner une réponse JSON avec message de confirmation
        Map<String, Object> response = new HashMap<>();
        response.put("supprimé", true);
        response.put("message", "Projet supprimé avec succès");
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // ENDPOINTS TÂCHES - Gestion du Kanban (TO_DO / DOING / DONE)
    // ============================================================

    /**
     * POST /api/projets/{id}/taches
     * Ajoute une nouvelle tâche à un projet.
     * Recalcule automatiquement l'avancement du projet.
     *
     * @param projetId l'identifiant du projet parent
     * @param tache    la tâche à ajouter (JSON)
     */
    @PostMapping("/{id}/taches")
    public ResponseEntity<Projet> ajouterTache(
            @PathVariable("id") String projetId,
            @RequestBody Tache tache) {
        Projet projet = projetService.ajouterTache(projetId, tache);
        return ResponseEntity.status(HttpStatus.CREATED).body(projet);
    }

    /**
     * PUT /api/projets/{id}/taches/{tacheId}/statut
     * Met à jour le statut d'une tâche (déplacement dans le Kanban).
     * Recalcule automatiquement le pourcentage d'avancement.
     *
     * @param projetId      l'identifiant du projet
     * @param tacheId       l'identifiant de la tâche
     * @param body          objet JSON contenant { "statut": "DONE" }
     */
    @PutMapping("/{id}/taches/{tacheId}/statut")
    public ResponseEntity<Projet> mettreAJourStatutTache(
            @PathVariable("id") String projetId,
            @PathVariable String tacheId,
            @RequestBody Map<String, String> body) {
        String nouveauStatut = body.get("statut");
        Projet projet = projetService.mettreAJourStatutTache(projetId, tacheId, nouveauStatut);
        return ResponseEntity.ok(projet);
    }

    /**
     * DELETE /api/projets/{id}/taches/{tacheId}
     * Supprime une tâche d'un projet.
     * Recalcule automatiquement l'avancement après suppression.
     *
     * @param projetId l'identifiant du projet
     * @param tacheId  l'identifiant de la tâche à supprimer
     */
    @DeleteMapping("/{id}/taches/{tacheId}")
    public ResponseEntity<Projet> supprimerTache(
            @PathVariable("id") String projetId,
            @PathVariable String tacheId) {
        Projet projet = projetService.supprimerTache(projetId, tacheId);
        return ResponseEntity.ok(projet);
    }

    // ============================================================
    // ENDPOINTS MEMBRES - Gestion du groupe
    // ============================================================

    /**
     * POST /api/projets/{id}/membres
     * Ajoute un nouveau membre au groupe du projet.
     *
     * @param projetId l'identifiant du projet
     * @param body     objet JSON contenant { "membre": "nom_ou_email" }
     */
    @PostMapping("/{id}/membres")
    public ResponseEntity<Projet> ajouterMembre(
            @PathVariable("id") String projetId,
            @RequestBody Map<String, String> body) {
        String membre = body.get("membre");
        Projet projet = projetService.ajouterMembre(projetId, membre);
        return ResponseEntity.ok(projet);
    }

    // ============================================================
    // ENDPOINT DE FILTRAGE PAR STATUT
    // ============================================================

    /**
     * GET /api/projets/statut/{statut}
     * Filtre les projets par statut : EN_COURS, TERMINÉ, EN_RETARD
     *
     * @param statut le statut à filtrer
     */
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Projet>> getProjetsByStatut(@PathVariable String statut) {
        List<Projet> projets = projetService.getProjetsByStatut(statut);
        return ResponseEntity.ok(projets);
    }
}
