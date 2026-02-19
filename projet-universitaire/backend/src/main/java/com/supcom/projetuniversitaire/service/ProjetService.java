package com.supcom.projetuniversitaire.service;

import com.supcom.projetuniversitaire.exception.ResourceNotFoundException;
import com.supcom.projetuniversitaire.model.Projet;
import com.supcom.projetuniversitaire.model.Tache;
import com.supcom.projetuniversitaire.repository.ProjetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * ============================================================
 * SERVICE : ProjetService
 * ============================================================
 * Couche de logique métier pour la gestion des projets universitaires.
 * Cette classe fait le lien entre le Controller (HTTP) et le Repository (DB).
 *
 * Responsabilités :
 *   - Valider et traiter les données avant de les sauvegarder
 *   - Calculer automatiquement l'avancement (%)
 *   - Vérifier les indicateurs de retard
 *   - Gérer les tâches (ajout, modification, suppression)
 * ============================================================
 */
@Service
public class ProjetService {

    // Injection du repository pour accéder à MongoDB
    @Autowired
    private ProjetRepository projetRepository;

    // ============================================================
    // OPÉRATIONS CRUD SUR LES PROJETS
    // ============================================================

    /**
     * Récupère tous les projets de la base de données.
     * Met à jour les indicateurs de retard avant de retourner.
     *
     * @return liste de tous les projets
     */
    public List<Projet> getTousLesProjets() {
        List<Projet> projets = projetRepository.findAll();
        // Mettre à jour le statut de retard pour chaque projet
        projets.forEach(p -> {
            p.verifierRetard();
            // Mettre à jour les tâches en retard
            if (p.getTaches() != null) {
                p.getTaches().forEach(Tache::verifierRetard);
            }
        });
        return projets;
    }

    /**
     * Récupère un projet par son identifiant MongoDB.
     *
     * @param id l'identifiant du projet
     * @return le projet trouvé
     * @throws ResourceNotFoundException si le projet n'existe pas
     */
    public Projet getProjetParId(String id) {
        Projet projet = projetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Projet non trouvé avec l'identifiant : " + id));

        // Mettre à jour l'avancement et le statut avant de retourner
        projet.calculerAvancement();
        projet.verifierRetard();

        return projet;
    }

    /**
     * Crée un nouveau projet et le sauvegarde en base.
     * Initialise l'avancement à 0% et le statut à "EN_COURS".
     *
     * @param projet le projet à créer
     * @return le projet créé avec son ID généré par MongoDB
     */
    public Projet creerProjet(Projet projet) {
        // Initialisation de l'avancement
        projet.calculerAvancement();
        // Vérification du statut initial
        projet.verifierRetard();
        // Sauvegarde en base MongoDB
        return projetRepository.save(projet);
    }

    /**
     * Met à jour un projet existant.
     * Recalcule automatiquement l'avancement après la mise à jour.
     *
     * @param id l'identifiant du projet à mettre à jour
     * @param projetDetails les nouvelles données du projet
     * @return le projet mis à jour
     * @throws ResourceNotFoundException si le projet n'existe pas
     */
    public Projet mettreAJourProjet(String id, Projet projetDetails) {
        // Vérifier que le projet existe
        Projet projetExistant = getProjetParId(id);

        // Mettre à jour les champs modifiables
        projetExistant.setTitre(projetDetails.getTitre());
        projetExistant.setDescription(projetDetails.getDescription());
        projetExistant.setMatiere(projetDetails.getMatiere());
        projetExistant.setDateLimite(projetDetails.getDateLimite());
        projetExistant.setMembres(projetDetails.getMembres());

        // Recalculer l'avancement après modification
        projetExistant.calculerAvancement();
        projetExistant.verifierRetard();

        // Sauvegarder les modifications
        return projetRepository.save(projetExistant);
    }

    /**
     * Supprime un projet par son identifiant.
     *
     * @param id l'identifiant du projet à supprimer
     * @throws ResourceNotFoundException si le projet n'existe pas
     */
    public void supprimerProjet(String id) {
        // Vérifier que le projet existe avant de supprimer
        Projet projet = getProjetParId(id);
        projetRepository.delete(projet);
    }

    // ============================================================
    // OPÉRATIONS SUR LES TÂCHES D'UN PROJET
    // ============================================================

    /**
     * Ajoute une nouvelle tâche à un projet existant.
     * Recalcule l'avancement après l'ajout.
     *
     * @param projetId l'identifiant du projet
     * @param tache    la tâche à ajouter
     * @return le projet mis à jour avec la nouvelle tâche
     */
    public Projet ajouterTache(String projetId, Tache tache) {
        Projet projet = getProjetParId(projetId);

        // Vérifier le retard de la nouvelle tâche
        tache.verifierRetard();

        // Ajouter la tâche à la liste
        projet.getTaches().add(tache);

        // Recalculer l'avancement global du projet
        projet.calculerAvancement();
        projet.verifierRetard();

        return projetRepository.save(projet);
    }

    /**
     * Met à jour le statut d'une tâche (TO_DO → DOING → DONE).
     * Recalcule automatiquement l'avancement du projet parent.
     *
     * @param projetId l'identifiant du projet
     * @param tacheId  l'identifiant de la tâche à modifier
     * @param nouveauStatut le nouveau statut ("TO_DO", "DOING", "DONE")
     * @return le projet mis à jour
     */
    public Projet mettreAJourStatutTache(String projetId, String tacheId, String nouveauStatut) {
        Projet projet = getProjetParId(projetId);

        // Trouver et mettre à jour la tâche concernée
        projet.getTaches().stream()
                .filter(t -> t.getId().equals(tacheId))
                .findFirst()
                .ifPresent(tache -> {
                    tache.setStatut(nouveauStatut);
                    tache.verifierRetard(); // Recalculer le retard après changement de statut
                });

        // Recalculer l'avancement global après le changement de statut
        projet.calculerAvancement();
        projet.verifierRetard();

        return projetRepository.save(projet);
    }

    /**
     * Supprime une tâche d'un projet.
     * Recalcule l'avancement après suppression.
     *
     * @param projetId l'identifiant du projet
     * @param tacheId  l'identifiant de la tâche à supprimer
     * @return le projet mis à jour
     */
    public Projet supprimerTache(String projetId, String tacheId) {
        Projet projet = getProjetParId(projetId);

        // Supprimer la tâche correspondante de la liste
        projet.getTaches().removeIf(t -> t.getId().equals(tacheId));

        // Recalculer l'avancement après suppression
        projet.calculerAvancement();
        projet.verifierRetard();

        return projetRepository.save(projet);
    }

    // ============================================================
    // OPÉRATIONS DE RECHERCHE ET FILTRAGE
    // ============================================================

    /**
     * Filtre les projets par statut.
     *
     * @param statut le statut à filtrer ("EN_COURS", "TERMINÉ", "EN_RETARD")
     * @return liste filtrée des projets
     */
    public List<Projet> getProjetsByStatut(String statut) {
        return projetRepository.findByStatut(statut);
    }

    /**
     * Ajoute un membre à un projet existant.
     *
     * @param projetId l'identifiant du projet
     * @param membre   le nom/email du membre à ajouter
     * @return le projet mis à jour
     */
    public Projet ajouterMembre(String projetId, String membre) {
        Projet projet = getProjetParId(projetId);

        // Vérifier que le membre n'est pas déjà dans le groupe
        if (!projet.getMembres().contains(membre)) {
            projet.getMembres().add(membre);
            return projetRepository.save(projet);
        }
        return projet;
    }
}
