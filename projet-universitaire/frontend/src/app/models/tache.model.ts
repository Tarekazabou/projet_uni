/**
 * ============================================================
 * MODÈLE : Tache
 * ============================================================
 * Interface TypeScript représentant une tâche d'un projet universitaire.
 * Correspond exactement à la structure JSON retournée par le backend Spring Boot.
 * ============================================================
 */
export interface Tache {
  /** Identifiant unique de la tâche (UUID généré par le backend) */
  id?: string;

  /** Titre court et descriptif de la tâche */
  titre: string;

  /** Description détaillée de ce qui doit être fait */
  description?: string;

  /** Nom ou email du membre du groupe assigné à cette tâche */
  assigneA?: string;

  /** Statut Kanban de la tâche : 'TO_DO' | 'DOING' | 'DONE' */
  statut: 'TO_DO' | 'DOING' | 'DONE';

  /** Niveau de priorité : 'FAIBLE' | 'MOYENNE' | 'ÉLEVÉE' */
  priorite: 'FAIBLE' | 'MOYENNE' | 'ÉLEVÉE';

  /** Date limite de la tâche (format ISO 8601 : YYYY-MM-DD) */
  dateLimite?: string;

  /** Indicateur calculé automatiquement par le backend : true si la date est dépassée */
  enRetard?: boolean;
}
