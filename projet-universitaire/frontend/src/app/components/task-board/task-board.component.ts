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
      <div class="header-left">
        <h3 class="board-title">📋 Tableau des Tâches</h3>
        <div class="avancement-global">
          <div class="mini-barre">
            <div class="mini-fill" [style.width.%]="projet?.avancement"></div>
          </div>
          <span class="avancement-text">{{ projet?.avancement | number:'1.0-0' }}%</span>
        </div>
      </div>
      <button class="btn-add-task" (click)="afficherFormulaire.set(!afficherFormulaire())">
        @if (afficherFormulaire()) {
          <span>✕</span> Fermer
        } @else {
          <span>✨</span> Nouvelle Tâche
        }
      </button>
    </div>

    <!-- ============================
         FORMULAIRE D'AJOUT DE TÂCHE
         ============================ -->
    @if (afficherFormulaire()) {
      <div class="form-tache animate-scale-in">
        <h4>Ajouter une tâche</h4>
        <div class="form-row">
          <div class="input-wrapper" style="flex:2">
            <input type="text" class="form-control" placeholder="Titre de la tâche *"
                   [(ngModel)]="nouvelleTache.titre" />
          </div>
          <select class="form-control select-control" [(ngModel)]="nouvelleTache.priorite" style="flex:1">
            <option value="FAIBLE">🟢 Faible</option>
            <option value="MOYENNE">🟡 Moyenne</option>
            <option value="ÉLEVÉE">🔴 Élevée</option>
          </select>
        </div>
        <div class="form-row">
          <div class="input-wrapper" style="flex:1">
            <input type="text" class="form-control" placeholder="Assignée à..."
                   [(ngModel)]="nouvelleTache.assigneA" />
          </div>
          <input type="date" class="form-control" style="flex:1"
                 [(ngModel)]="nouvelleTache.dateLimite" />
        </div>
        <textarea class="form-control textarea" placeholder="Description (optionnel)..." rows="2"
                  [(ngModel)]="nouvelleTache.description"></textarea>
        <div class="form-actions">
          <button class="btn btn-ghost" (click)="afficherFormulaire.set(false)">Annuler</button>
          <button class="btn btn-success" (click)="ajouterTache()"
                  [disabled]="!nouvelleTache.titre">
            ✅ Ajouter
          </button>
        </div>
      </div>
    }

    <!-- ============================
         TABLEAU KANBAN - 3 COLONNES
         ============================ -->
    <div class="kanban-board">

      <!-- COLONNE TO DO -->
      <div class="colonne">
        <div class="colonne-header todo">
          <div class="colonne-header-left">
            <span class="colonne-dot todo-dot"></span>
            <span class="colonne-titre">À Faire</span>
          </div>
          <span class="badge-count">{{ getTachesParStatut('TO_DO').length }}</span>
        </div>
        <div class="taches-liste">
          @for (tache of getTachesParStatut('TO_DO'); track tache.id; let i = $index) {
            <div class="carte-tache" [class.en-retard]="tache.enRetard"
                 [style.animation-delay]="(i * 0.05) + 's'">
              <ng-container *ngTemplateOutlet="carteTache; context: { tache: tache }"></ng-container>
            </div>
          }
          @if (getTachesParStatut('TO_DO').length === 0) {
            <div class="colonne-vide">
              <span class="vide-icon">📌</span>
              <span>Aucune tâche</span>
            </div>
          }
        </div>
      </div>

      <!-- COLONNE DOING -->
      <div class="colonne">
        <div class="colonne-header doing">
          <div class="colonne-header-left">
            <span class="colonne-dot doing-dot"></span>
            <span class="colonne-titre">En Cours</span>
          </div>
          <span class="badge-count doing-count">{{ getTachesParStatut('DOING').length }}</span>
        </div>
        <div class="taches-liste">
          @for (tache of getTachesParStatut('DOING'); track tache.id; let i = $index) {
            <div class="carte-tache" [class.en-retard]="tache.enRetard"
                 [style.animation-delay]="(i * 0.05) + 's'">
              <ng-container *ngTemplateOutlet="carteTache; context: { tache: tache }"></ng-container>
            </div>
          }
          @if (getTachesParStatut('DOING').length === 0) {
            <div class="colonne-vide">
              <span class="vide-icon">⚡</span>
              <span>Aucune tâche</span>
            </div>
          }
        </div>
      </div>

      <!-- COLONNE DONE -->
      <div class="colonne">
        <div class="colonne-header done">
          <div class="colonne-header-left">
            <span class="colonne-dot done-dot"></span>
            <span class="colonne-titre">Terminées</span>
          </div>
          <span class="badge-count done-count">{{ getTachesParStatut('DONE').length }}</span>
        </div>
        <div class="taches-liste">
          @for (tache of getTachesParStatut('DONE'); track tache.id; let i = $index) {
            <div class="carte-tache done-card" [style.animation-delay]="(i * 0.05) + 's'">
              <ng-container *ngTemplateOutlet="carteTache; context: { tache: tache }"></ng-container>
            </div>
          }
          @if (getTachesParStatut('DONE').length === 0) {
            <div class="colonne-vide">
              <span class="vide-icon">✅</span>
              <span>Aucune tâche</span>
            </div>
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
        <strong class="tache-titre">{{ tache.titre }}</strong>
        <span class="badge-priorite" [ngClass]="getClassPriorite(tache.priorite)">
          {{ getPrioriteLabel(tache.priorite) }}
        </span>
      </div>

      <!-- Description -->
      @if (tache.description) {
        <p class="tache-desc">{{ tache.description }}</p>
      }

      <!-- Métadonnées -->
      <div class="tache-meta">
        @if (tache.assigneA) {
          <div class="meta-chip">
            <span class="meta-avatar">{{ tache.assigneA.charAt(0).toUpperCase() }}</span>
            {{ tache.assigneA }}
          </div>
        }
        @if (tache.dateLimite) {
          <div class="meta-chip date-chip" [class.overdue]="tache.enRetard">
            📅 {{ tache.dateLimite | date:'dd MMM' }}
          </div>
        }
      </div>

      <!-- Boutons de déplacement Kanban -->
      <div class="tache-actions">
        @if (tache.statut !== 'TO_DO') {
          <button class="btn-move" (click)="deplacerTache(tache, 'prev')" title="Reculer">
            ◀
          </button>
        }
        @if (tache.statut !== 'DONE') {
          <button class="btn-move btn-move-next" (click)="deplacerTache(tache, 'next')" title="Avancer">
            ▶
          </button>
        }
        <button class="btn-delete" (click)="supprimerTache(tache.id!)" title="Supprimer">
          🗑
        </button>
      </div>
    </ng-template>
  `,
  styles: [`
    /* Board Header */
    .board-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      gap: 16px;
      flex-wrap: wrap;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .board-title { margin: 0; font-size: 18px; font-weight: 700; color: var(--text-primary); }
    .avancement-global {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .mini-barre {
      width: 80px;
      height: 6px;
      background: #f0f2f5;
      border-radius: var(--radius-full);
      overflow: hidden;
    }
    .mini-fill {
      height: 100%;
      background: var(--gradient-primary);
      border-radius: var(--radius-full);
      transition: width 0.6s ease;
    }
    .avancement-text { font-size: 13px; font-weight: 700; color: var(--primary); }

    .btn-add-task {
      padding: 10px 20px;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      background: var(--gradient-primary);
      color: white;
      transition: all var(--transition-normal);
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 15px rgba(67, 97, 238, 0.25);
      font-family: inherit;
    }
    .btn-add-task:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(67, 97, 238, 0.35);
    }

    /* Task Form */
    .form-tache {
      background: #f8f9fb;
      border-radius: var(--radius-lg);
      padding: 24px;
      margin-bottom: 24px;
      border: 1px solid rgba(0,0,0,0.04);
    }
    .form-tache h4 {
      margin: 0 0 16px;
      color: var(--text-primary);
      font-size: 16px;
      font-weight: 700;
    }
    .form-row { display: flex; gap: 12px; margin-bottom: 12px; }
    .input-wrapper { position: relative; }
    .form-control {
      padding: 11px 14px;
      border: 2px solid #e8ecf1;
      border-radius: var(--radius-sm);
      font-size: 14px;
      transition: all var(--transition-normal);
      background: white;
      font-family: inherit;
      width: 100%;
    }
    .form-control:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.1);
    }
    .select-control { cursor: pointer; }
    .textarea { resize: vertical; min-height: 60px; margin-bottom: 12px; }
    .form-actions { display: flex; gap: 10px; justify-content: flex-end; }

    /* Kanban Board */
    .kanban-board {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .colonne {
      background: #f8f9fb;
      border-radius: var(--radius-lg);
      padding: 16px;
      min-height: 320px;
      border: 1px solid rgba(0,0,0,0.04);
    }
    .colonne-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid transparent;
    }
    .colonne-header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .colonne-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .todo-dot { background: var(--warning); }
    .doing-dot { background: var(--primary); }
    .done-dot { background: var(--success); }

    .colonne-header.todo { border-bottom-color: var(--warning); }
    .colonne-header.doing { border-bottom-color: var(--primary); }
    .colonne-header.done { border-bottom-color: var(--success); }

    .colonne-titre { font-weight: 700; font-size: 14px; color: var(--text-primary); }
    .badge-count {
      background: var(--bg-main);
      color: var(--text-secondary);
      padding: 3px 10px;
      border-radius: var(--radius-full);
      font-size: 12px;
      font-weight: 700;
    }
    .doing-count { background: #e8f4fd; color: var(--primary); }
    .done-count { background: #e6f9f0; color: #0d9058; }

    /* Task Cards */
    .carte-tache {
      background: white;
      border-radius: var(--radius-md);
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: var(--shadow-sm);
      position: relative;
      transition: all var(--transition-normal);
      animation: fadeInUp 0.3s ease-out both;
      border: 1px solid rgba(0,0,0,0.04);
    }
    .carte-tache:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    .carte-tache.en-retard {
      border-left: 3px solid var(--danger);
    }
    .carte-tache.done-card {
      opacity: 0.75;
    }
    .carte-tache.done-card .tache-titre {
      text-decoration: line-through;
      color: var(--text-muted);
    }

    .badge-retard {
      background: #fde8ed;
      color: #c0392b;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      display: inline-block;
      margin-bottom: 8px;
      letter-spacing: 0.3px;
    }
    .tache-titre-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 8px;
    }
    .tache-titre {
      font-size: 14px;
      color: var(--text-primary);
      line-height: 1.4;
    }
    .badge-priorite {
      font-size: 10px;
      padding: 3px 8px;
      border-radius: var(--radius-full);
      white-space: nowrap;
      font-weight: 600;
      letter-spacing: 0.3px;
    }
    .priorite-faible { background: #e6f9f0; color: #0d9058; }
    .priorite-moyenne { background: #fff8e1; color: #f57f17; }
    .priorite-élevée { background: #fde8ed; color: #c0392b; }

    .tache-desc {
      font-size: 13px;
      color: var(--text-muted);
      margin: 0 0 10px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Task Metadata */
    .tache-meta {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }
    .meta-chip {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      color: var(--text-muted);
      background: #f8f9fb;
      padding: 4px 10px;
      border-radius: var(--radius-full);
    }
    .meta-avatar {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--gradient-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
    }
    .date-chip.overdue { background: #fde8ed; color: var(--danger); font-weight: 600; }

    /* Task Actions */
    .tache-actions {
      display: flex;
      gap: 6px;
      justify-content: flex-end;
      padding-top: 10px;
      border-top: 1px solid #f0f2f5;
    }
    .btn-move {
      background: #f0f2f5;
      border: none;
      border-radius: var(--radius-sm);
      padding: 6px 10px;
      cursor: pointer;
      font-size: 11px;
      transition: all var(--transition-normal);
      color: var(--text-secondary);
    }
    .btn-move:hover { background: var(--primary); color: white; transform: scale(1.05); }
    .btn-move-next:hover { background: var(--success); }
    .btn-delete {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
      opacity: 0.5;
    }
    .btn-delete:hover { opacity: 1; background: #fde8ed; }

    .colonne-vide {
      text-align: center;
      color: var(--text-muted);
      font-size: 13px;
      padding: 30px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .vide-icon { font-size: 24px; opacity: 0.5; }

    /* Buttons */
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all var(--transition-normal);
      font-family: inherit;
    }
    .btn-success {
      background: var(--gradient-success);
      color: white;
      box-shadow: 0 4px 12px rgba(6, 214, 160, 0.25);
    }
    .btn-success:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(6, 214, 160, 0.35);
    }
    .btn-ghost {
      background: transparent;
      color: var(--text-secondary);
    }
    .btn-ghost:hover { background: #f0f2f5; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }

    @media (max-width: 768px) {
      .kanban-board { grid-template-columns: 1fr; }
      .form-row { flex-direction: column; }
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

  /**
   * Retourne le label selon la priorité de la tâche.
   */
  getPrioriteLabel(priorite: string): string {
    const labels: Record<string, string> = {
      'FAIBLE': '🟢 Faible',
      'MOYENNE': '🟡 Moyenne',
      'ÉLEVÉE': '🔴 Élevée'
    };
    return labels[priorite] || priorite;
  }
}
