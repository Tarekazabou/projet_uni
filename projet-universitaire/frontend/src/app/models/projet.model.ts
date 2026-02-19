/**
 * ============================================================
 * MODÈLE : Projet
 * ============================================================
 * Interface TypeScript représentant un projet universitaire complet.
 * Correspond à la structure JSON retournée par le backend Spring Boot.
 * ============================================================
 */
import { Tache } from './tache.model';

export interface Projet {
  /** Identifiant unique MongoDB (ObjectId en string) */
  id?: string;

  /** Titre du projet universitaire */
  titre: string;

  /** Description détaillée du projet */
  description?: string;

  /** Matière / Module universitaire concerné */
  matiere?: string;

  /** Date de création du projet (format ISO : YYYY-MM-DD) */
  dateCreation?: string;

  /** Date limite de rendu (format ISO : YYYY-MM-DD) */
  dateLimite?: string;

  /** Liste des membres du groupe (noms ou emails) */
  membres: string[];

  /** Liste des tâches associées au projet */
  taches: Tache[];

  /** Pourcentage d'avancement calculé automatiquement (0 à 100) */
  avancement: number;

  /** Statut global : 'EN_COURS' | 'TERMINÉ' | 'EN_RETARD' */
  statut: string;
}
