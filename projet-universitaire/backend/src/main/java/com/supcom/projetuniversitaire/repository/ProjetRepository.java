package com.supcom.projetuniversitaire.repository;

import com.supcom.projetuniversitaire.model.Projet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ============================================================
 * REPOSITORY : ProjetRepository
 * ============================================================
 * Interface d'accès aux données pour la collection "projets" MongoDB.
 * En héritant de MongoRepository<Projet, String>, Spring Data génère
 * automatiquement toutes les opérations CRUD sans écrire de code SQL :
 *   - findAll()    → récupérer tous les projets
 *   - findById()   → récupérer un projet par son ID
 *   - save()       → créer ou mettre à jour un projet
 *   - deleteById() → supprimer un projet par son ID
 *
 * On peut également déclarer des méthodes personnalisées
 * que Spring Data MongoDB traduit automatiquement en requêtes.
 * ============================================================
 */
@Repository
public interface ProjetRepository extends MongoRepository<Projet, String> {

    /**
     * Recherche des projets par leur statut.
     * Exemple : findByStatut("EN_RETARD") retourne tous les projets en retard.
     *
     * @param statut le statut à filtrer ("EN_COURS", "TERMINÉ", "EN_RETARD")
     * @return liste des projets correspondants
     */
    List<Projet> findByStatut(String statut);

    /**
     * Recherche des projets contenant un membre spécifique.
     * Utile pour afficher "mes projets" selon l'utilisateur connecté.
     *
     * @param membre le nom/email du membre à rechercher
     * @return liste des projets où ce membre est impliqué
     */
    List<Projet> findByMembresContaining(String membre);

    /**
     * Recherche des projets par leur matière universitaire.
     *
     * @param matiere la matière (ex : "Ingénierie des services numériques")
     * @return liste des projets correspondants
     */
    List<Projet> findByMatiere(String matiere);

    /**
     * Recherche des projets dont le titre contient une chaîne (insensible à la casse).
     * Utile pour la fonctionnalité de recherche.
     *
     * @param titre fragment du titre à rechercher
     * @return liste des projets correspondants
     */
    List<Projet> findByTitreContainingIgnoreCase(String titre);
}
