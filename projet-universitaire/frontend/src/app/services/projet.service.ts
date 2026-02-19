/**
 * ============================================================
 * SERVICE : ProjetService (Angular)
 * ============================================================
 * Service Angular pour communiquer avec l'API REST Spring Boot.
 * Utilise HttpClient pour envoyer des requêtes HTTP (GET, POST, PUT, DELETE).
 *
 * URL de base de l'API : http://localhost:8080/api/projets
 *
 * Ce service est injecté dans les composants Angular qui ont
 * besoin d'accéder aux données des projets.
 * ============================================================
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Projet } from '../models/projet.model';
import { Tache } from '../models/tache.model';

@Injectable({
  providedIn: 'root' // Service disponible globalement dans toute l'application
})
export class ProjetService {

  /** URL de base de l'API backend Spring Boot */
  private apiUrl = 'http://localhost:8080/api/projets';

  /** Injection du client HTTP Angular */
  private http = inject(HttpClient);

  // ============================================================
  // MÉTHODES CRUD POUR LES PROJETS
  // ============================================================

  /**
   * Récupère la liste complète de tous les projets.
   * Correspond à : GET /api/projets
   *
   * @returns Observable<Projet[]> flux de données avec la liste des projets
   */
  getTousLesProjets(): Observable<Projet[]> {
    return this.http.get<Projet[]>(this.apiUrl);
  }

  /**
   * Récupère un projet spécifique par son identifiant.
   * Correspond à : GET /api/projets/{id}
   *
   * @param id l'identifiant MongoDB du projet
   * @returns Observable<Projet> flux contenant le projet
   */
  getProjetParId(id: string): Observable<Projet> {
    return this.http.get<Projet>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée un nouveau projet universitaire.
   * Correspond à : POST /api/projets
   *
   * @param projet les données du nouveau projet
   * @returns Observable<Projet> le projet créé avec son ID généré
   */
  creerProjet(projet: Projet): Observable<Projet> {
    return this.http.post<Projet>(this.apiUrl, projet);
  }

  /**
   * Met à jour un projet existant.
   * Correspond à : PUT /api/projets/{id}
   *
   * @param id      l'identifiant du projet à modifier
   * @param projet  les nouvelles données du projet
   * @returns Observable<Projet> le projet mis à jour
   */
  mettreAJourProjet(id: string, projet: Projet): Observable<Projet> {
    return this.http.put<Projet>(`${this.apiUrl}/${id}`, projet);
  }

  /**
   * Supprime un projet par son identifiant.
   * Correspond à : DELETE /api/projets/{id}
   *
   * @param id l'identifiant du projet à supprimer
   * @returns Observable<any> réponse de confirmation
   */
  supprimerProjet(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ============================================================
  // MÉTHODES POUR LA GESTION DES TÂCHES (KANBAN)
  // ============================================================

  /**
   * Ajoute une nouvelle tâche à un projet existant.
   * Correspond à : POST /api/projets/{id}/taches
   *
   * @param projetId l'identifiant du projet parent
   * @param tache    la tâche à ajouter
   * @returns Observable<Projet> le projet mis à jour avec la nouvelle tâche
   */
  ajouterTache(projetId: string, tache: Tache): Observable<Projet> {
    return this.http.post<Projet>(`${this.apiUrl}/${projetId}/taches`, tache);
  }

  /**
   * Met à jour le statut d'une tâche (déplacement Kanban).
   * Correspond à : PUT /api/projets/{id}/taches/{tacheId}/statut
   *
   * @param projetId      l'identifiant du projet
   * @param tacheId       l'identifiant de la tâche
   * @param nouveauStatut le nouveau statut : 'TO_DO', 'DOING', 'DONE'
   * @returns Observable<Projet> le projet mis à jour avec l'avancement recalculé
   */
  mettreAJourStatutTache(projetId: string, tacheId: string, nouveauStatut: string): Observable<Projet> {
    return this.http.put<Projet>(
      `${this.apiUrl}/${projetId}/taches/${tacheId}/statut`,
      { statut: nouveauStatut }
    );
  }

  /**
   * Supprime une tâche d'un projet.
   * Correspond à : DELETE /api/projets/{id}/taches/{tacheId}
   *
   * @param projetId l'identifiant du projet
   * @param tacheId  l'identifiant de la tâche à supprimer
   * @returns Observable<Projet> le projet mis à jour
   */
  supprimerTache(projetId: string, tacheId: string): Observable<Projet> {
    return this.http.delete<Projet>(`${this.apiUrl}/${projetId}/taches/${tacheId}`);
  }

  // ============================================================
  // MÉTHODES POUR LA GESTION DES MEMBRES DU GROUPE
  // ============================================================

  /**
   * Ajoute un membre au groupe d'un projet.
   * Correspond à : POST /api/projets/{id}/membres
   *
   * @param projetId l'identifiant du projet
   * @param membre   le nom ou email du membre à ajouter
   * @returns Observable<Projet> le projet mis à jour
   */
  ajouterMembre(projetId: string, membre: string): Observable<Projet> {
    return this.http.post<Projet>(`${this.apiUrl}/${projetId}/membres`, { membre });
  }

  /**
   * Filtre les projets par statut.
   * Correspond à : GET /api/projets/statut/{statut}
   *
   * @param statut 'EN_COURS', 'TERMINÉ', ou 'EN_RETARD'
   * @returns Observable<Projet[]> liste filtrée
   */
  getProjetsByStatut(statut: string): Observable<Projet[]> {
    return this.http.get<Projet[]>(`${this.apiUrl}/statut/${statut}`);
  }
}
