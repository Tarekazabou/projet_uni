/**
 * ============================================================
 * COMPOSANT : TaskBoardComponent
 * ============================================================
 * Tableau Kanban pour la gestion des tâches d'un projet.
 * Affiche 3 colonnes : TO DO | DOING | DONE
 * Fonctionnalités :
 *   - Ajouter une tâche
 *   - Déplacer une tâche entre les colonnes
 *   - Supprimer une tâche
 *   - Indicateur visuel de retard (badge rouge)
 *   - Calcul automatique de l'avancement
 * ============================================================
 */
import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjetService } from '../../services/projet.service';
import { Tache } from '../../models/tache.model';
import { Projet } from '../../models/projet.model';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- ============================
         EN-TÊTE DU KANBAN
         ============================ -->
    <div class="board-header">
      <h3>📋 Tableau des Tâches</h3>
      <div class="avancement-global">
        <span>Avancement : <strong>{{ projet?.avancement | number:'1.0-0' }}%</strong></span>
        <div class="mini-barre">
          <div class="mini-fill" [style.width.%]="projet?.avancement"></div>
        </div>
      </div>
      <button class="btn btn-primary btn-sm" (click)="afficherFormulaire.set(!afficherFormulaire())">
        {{ afficherFormulaire() ? '✕ Annuler' : '➕ Nouvelle Tâche' }}
      </button>
    </div>

    <!-- ============================
         FORMULAIRE D'AJOUT DE TÂCHE
         ============================ -->
    @if (afficherFormulaire()) {
      <div class="form-tache">
        <h4>Ajouter une tâche</h4>
        <div class="form-row">
          <input type="text" class="form-control" placeholder="Titre de la tâche *"
                 [(ngModel)]="nouvelleTache.titre" />
          <select class="form-control" [(ngModel)]="nouvelleTache.priorite">
            <option value="FAIBLE">🟢 Faible</option>
            <option value="MOYENNE">🟡 Moyenne</option>
            <option value="ÉLEVÉE">🔴 Élevée</option>
          </select>
        </div>
        <div class="form-row">
          <input type="text" class="form-control" placeholder="Assignée à..."
                 [(ngModel)]="nouvelleTache.assigneA" />
          <input type="date" class="form-control"
                 [(ngModel)]="nouvelleTache.dateLimite" />
        </div>
        <textarea class="form-control" placeholder="Description..." rows="2"
                  [(ngModel)]="nouvelleTache.description"></textarea>
        <button class="btn btn-success" (click)="ajouterTache()"
                [disabled]="!nouvelleTache.titre">
          ✅ Ajouter la tâche
        </button>
      </div>
    }

    <!-- ============================
         TABLEAU KANBAN - 3 COLONNES
         ============================ -->
    <div class="kanban-board">

      <!-- COLONNE TO DO -->
      <div class="colonne todo">
        <div class="colonne-header">
          <span class="colonne-titre">📌 À Faire</span>
          <span class="badge-count">{{ getTachesParStatut('TO_DO').length }}</span>
        </div>
        <div class="taches-liste">
          @for (tache of getTachesParStatut('TO_DO'); track tache.id) {
            <div class="carte-tache" [class.en-retard]="tache.enRetard">
              <ng-container *ngTemplateOutlet="carteTache; context: { tache: tache }"></ng-container>
            </div>
          }
          @if (getTachesParStatut('TO_DO').length === 0) {
            <div class="colonne-vide">Aucune tâche</div>
          }
        </div>
      </div>

      <!-- COLONNE DOING -->
      <div class="colonne doing">
        <div class="colonne-header">
          <span class="colonne-titre">⚡ En Cours</span>
          <span class="badge-count">{{ getTachesParStatut('DOING').length }}</span>
        </div>
        <div class="taches-liste">
          @for (tache of getTachesParStatut('DOING'); track tache.id) {
            <div class="carte-tache" [class.en-retard]="tache.enRetard">
              <ng-container *ngTemplateOutlet="carteTache; context: { tache: tache }"></ng-container>
            </div>
          }
          @if (getTachesParStatut('DOING').length === 0) {
            <div class="colonne-vide">Aucune tâche</div>
          }
        </div>
      </div>

      <!-- COLONNE DONE -->
      <div class="colonne done">
        <div class="colonne-header">
          <span class="colonne-titre">✅ Terminées</span>
          <span class="badge-count">{{ getTachesParStatut('DONE').length }}</span>
        </div>
        <div class="taches-liste">
          @for (tache of getTachesParStatut('DONE'); track tache.id) {
            <div class="carte-tache">
              <ng-container *ngTemplateOutlet="carteTache; context: { tache: tache }"></ng-container>
            </div>
          }
          @if (getTachesParStatut('DONE').length === 0) {
            <div class="colonne-vide">Aucune tâche</div>
          }
        </div>
      </div>

    </div>

    <!-- ============================
         TEMPLATE RÉUTILISABLE : CARTE DE TÂCHE
         ============================ -->
    <ng-template #carteTache let-tache="tache">
      <!-- Badge retard -->
      @if (tache.enRetard) {
        <span class="badge-retard">⚠️ EN RETARD</span>
      }

      <!-- Titre et priorité -->
      <div class="tache-titre-row">
        <strong>{{ tache.titre }}</strong>
        <span class="badge-priorite" [ngClass]="getClassPriorite(tache.priorite)">
          {{ tache.priorite }}
        </span>
      </div>

      <!-- Assignée à -->
      @if (tache.assigneA) {
        <div class="tache-assignee">👤 {{ tache.assigneA }}</div>
      }

      <!-- Date limite -->
      @if (tache.dateLimite) {
        <div class="tache-date">📅 {{ tache.dateLimite | date:'dd/MM/yyyy' }}</div>
      }

      <!-- Description -->
      @if (tache.description) {
        <p class="tache-desc">{{ tache.description }}</p>
      }

      <!-- Boutons de déplacement Kanban -->
      <div class="tache-actions">
        @if (tache.statut !== 'TO_DO') {
          <button class="btn-move prev" (click)="deplacerTache(tache, 'prev')">◀</button>
        }
        @if (tache.statut !== 'DONE') {
          <button class="btn-move next" (click)="deplacerTache(tache, 'next')">▶</button>
        }
        <button class="btn-delete" (click)="supprimerTache(tache.id!)">🗑</button>
      </div>
    </ng-template>
  `,
  styles: [`
    .board-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .board-header h3 { margin: 0; flex: 1; }
    .avancement-global { display: flex; align-items: center; gap: 10px; font-size: 14px; }
    .mini-barre { width: 100px; height: 8px; background: #ecf0f1; border-radius: 4px; overflow: hidden; }
    .mini-fill { height: 100%; background: #4a6fa5; border-radius: 4px; transition: width 0.4s; }
    .form-tache {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 20px;
    }
    .form-tache h4 { margin: 0 0 12px; color: #2c3e50; }
    .form-row { display: flex; gap: 10px; margin-bottom: 10px; }
    .form-control {
      padding: 8px 12px;
      border: 2px solid #ddd;
      border-radius: 6px;
      font-size: 13px;
      flex: 1;
    }
    .form-control:focus { outline: none; border-color: #4a6fa5; }
    .kanban-board {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .colonne {
      background: #f4f6f8;
      border-radius: 10px;
      padding: 12px;
      min-height: 300px;
    }
    .colonne-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #ddd;
    }
    .colonne.todo .colonne-header { border-bottom-color: #f39c12; }
    .colonne.doing .colonne-header { border-bottom-color: #3498db; }
    .colonne.done .colonne-header { border-bottom-color: #27ae60; }
    .colonne-titre { font-weight: bold; font-size: 14px; }
    .badge-count {
      background: #4a6fa5;
      color: white;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 12px;
    }
    .carte-tache {
      background: white;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 10px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      position: relative;
    }
    .carte-tache.en-retard { border-left: 3px solid #e74c3c; }
    .badge-retard {
      background: #ffebee;
      color: #c62828;
      font-size: 10px;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 4px;
      display: block;
      margin-bottom: 6px;
    }
    .tache-titre-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 6px;
    }
    .badge-priorite {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 10px;
      white-space: nowrap;
    }
    .priorite-faible { background: #e8f5e9; color: #2e7d32; }
    .priorite-moyenne { background: #fff8e1; color: #f57f17; }
    .priorite-élevée { background: #ffebee; color: #c62828; }
    .tache-assignee, .tache-date { font-size: 12px; color: #7f8c8d; margin: 3px 0; }
    .tache-desc { font-size: 12px; color: #555; margin: 6px 0; }
    .tache-actions {
      display: flex;
      gap: 6px;
      margin-top: 10px;
      justify-content: flex-end;
    }
    .btn-move {
      background: #ecf0f1;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
      font-size: 12px;
    }
    .btn-move:hover { background: #4a6fa5; color: white; }
    .btn-delete {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      color: #e74c3c;
    }
    .colonne-vide { text-align: center; color: #bdc3c7; font-size: 13px; padding: 20px 0; }
    .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; }
    .btn-primary { background: #4a6fa5; color: white; }
    .btn-success { background: #27ae60; color: white; margin-top: 10px; }
    .btn-sm { padding: 6px 12px; font-size: 12px; }
    .btn:disabled { background: #b0bec5; cursor: not-allowed; }
    @media (max-width: 768px) {
      .kanban-board { grid-template-columns: 1fr; }
    }
  `]
})
export class TaskBoardComponent {

  /** Projet parent contenant les tâches - reçu du composant parent */
  @Input() projet: Projet | null = null;

  /** Événement émis vers le parent lorsque le projet est mis à jour */
  @Output() projetMisAJour = new EventEmitter<Projet>();

  private projetService = inject(ProjetService);

  /** Afficher ou masquer le formulaire d'ajout */
  afficherFormulaire = signal(false);

  /** Modèle de la nouvelle tâche à créer */
  nouvelleTache: Partial<Tache> = {
    titre: '',
    description: '',
    assigneA: '',
    priorite: 'MOYENNE',
    statut: 'TO_DO',
    dateLimite: ''
  };

  /**
   * Filtre les tâches par statut Kanban.
   *
   * @param statut 'TO_DO', 'DOING', ou 'DONE'
   * @returns liste des tâches ayant ce statut
   */
  getTachesParStatut(statut: string): Tache[] {
    return this.projet?.taches?.filter(t => t.statut === statut) || [];
  }

  /**
   * Ajoute une nouvelle tâche au projet.
   * Envoie la requête POST via le service et met à jour le projet parent.
   */
  ajouterTache(): void {
    if (!this.projet?.id || !this.nouvelleTache.titre) return;

    const tache = this.nouvelleTache as Tache;

    this.projetService.ajouterTache(this.projet.id, tache).subscribe({
      next: (projetMisAJour) => {
        this.projetMisAJour.emit(projetMisAJour); // Notifier le composant parent
        this.afficherFormulaire.set(false);
        // Réinitialiser le formulaire
        this.nouvelleTache = { titre: '', description: '', assigneA: '', priorite: 'MOYENNE', statut: 'TO_DO' };
      },
      error: (err) => console.error('Erreur ajout tâche:', err)
    });
  }

  /**
   * Déplace une tâche vers la colonne précédente ou suivante du Kanban.
   * Ordre : TO_DO ↔ DOING ↔ DONE
   *
   * @param tache la tâche à déplacer
   * @param direction 'prev' pour reculer, 'next' pour avancer
   */
  deplacerTache(tache: Tache, direction: 'prev' | 'next'): void {
    if (!this.projet?.id || !tache.id) return;

    // Définir l'ordre des statuts Kanban
    const ordre = ['TO_DO', 'DOING', 'DONE'];
    const indexActuel = ordre.indexOf(tache.statut);
    const nouvelIndex = direction === 'next' ? indexActuel + 1 : indexActuel - 1;

    // Vérifier que le nouvel index est valide
    if (nouvelIndex < 0 || nouvelIndex >= ordre.length) return;

    const nouveauStatut = ordre[nouvelIndex];

    this.projetService.mettreAJourStatutTache(this.projet.id, tache.id, nouveauStatut).subscribe({
      next: (projetMisAJour) => {
        this.projetMisAJour.emit(projetMisAJour); // Notifier le composant parent avec l'avancement mis à jour
      },
      error: (err) => console.error('Erreur mise à jour statut:', err)
    });
  }

  /**
   * Supprime une tâche du projet.
   *
   * @param tacheId l'identifiant de la tâche à supprimer
   */
  supprimerTache(tacheId: string): void {
    if (!this.projet?.id) return;

    if (confirm('Supprimer cette tâche ?')) {
      this.projetService.supprimerTache(this.projet.id, tacheId).subscribe({
        next: (projetMisAJour) => {
          this.projetMisAJour.emit(projetMisAJour);
        },
        error: (err) => console.error('Erreur suppression tâche:', err)
      });
    }
  }

  /**
   * Retourne la classe CSS selon la priorité de la tâche.
   *
   * @param priorite 'FAIBLE', 'MOYENNE', ou 'ÉLEVÉE'
   * @returns la classe CSS correspondante
   */
  getClassPriorite(priorite: string): string {
    const classes: Record<string, string> = {
      'FAIBLE': 'priorite-faible',
      'MOYENNE': 'priorite-moyenne',
      'ÉLEVÉE': 'priorite-élevée'
    };
    return classes[priorite] || 'priorite-moyenne';
  }
}
