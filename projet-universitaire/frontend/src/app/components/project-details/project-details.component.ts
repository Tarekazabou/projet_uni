/**
 * ============================================================
 * COMPOSANT : ProjectDetailsComponent
 * ============================================================
 * Affiche les détails complets d'un projet universitaire :
 *   - Informations générales (titre, description, dates)
 *   - Liste des membres du groupe
 *   - Tableau Kanban des tâches (TaskBoardComponent)
 *   - Barre d'avancement globale
 * ============================================================
 */
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProjetService } from '../../services/projet.service';
import { Projet } from '../../models/projet.model';
import { TaskBoardComponent } from '../task-board/task-board.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TaskBoardComponent],
  template: `
    <!-- Message de chargement -->
    @if (chargement()) {
      <div class="chargement">⏳ Chargement du projet...</div>
    }

    <!-- Contenu principal -->
    @if (projet()) {
      <div class="details-container">

        <!-- ============================
             EN-TÊTE DU PROJET
             ============================ -->
        <div class="projet-header">
          <div class="header-info">
            <button class="btn-retour" routerLink="/projets">← Retour</button>
            <h2>{{ projet()!.titre }}</h2>
            <span class="badge-statut" [ngClass]="getClassStatut(projet()!.statut)">
              {{ projet()!.statut }}
            </span>
          </div>

          <!-- Barre d'avancement globale -->
          <div class="avancement-bloc">
            <div class="avancement-texte">
              Avancement global : <strong>{{ projet()!.avancement | number:'1.0-0' }}%</strong>
              — {{ getTachesTerminees() }}/{{ projet()!.taches.length }} tâches terminées
            </div>
            <div class="barre-avancement">
              <div class="fill-avancement"
                   [style.width.%]="projet()!.avancement"
                   [class.complet]="projet()!.avancement >= 100">
              </div>
            </div>
          </div>
        </div>

        <!-- ============================
             INFORMATIONS GÉNÉRALES
             ============================ -->
        <div class="section-card">
          <h3>📋 Informations générales</h3>
          <div class="info-grille">
            <div class="info-item">
              <span class="info-label">Matière</span>
              <span class="info-valeur">{{ projet()!.matiere || '—' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date de création</span>
              <span class="info-valeur">{{ projet()!.dateCreation | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date limite</span>
              <span class="info-valeur" [class.retard]="projet()!.statut === 'EN_RETARD'">
                {{ projet()!.dateLimite ? (projet()!.dateLimite | date:'dd/MM/yyyy') : '—' }}
              </span>
            </div>
          </div>
          @if (projet()!.description) {
            <p class="description">{{ projet()!.description }}</p>
          }
        </div>

        <!-- ============================
             MEMBRES DU GROUPE
             ============================ -->
        <div class="section-card">
          <h3>👥 Membres du groupe ({{ projet()!.membres?.length || 0 }})</h3>
          <div class="membres-liste">
            @for (membre of projet()!.membres; track membre) {
              <span class="badge-membre">👤 {{ membre }}</span>
            }
            @if (!projet()!.membres?.length) {
              <span class="vide-msg">Aucun membre ajouté</span>
            }
          </div>

          <!-- Formulaire d'ajout de membre -->
          <div class="ajout-membre">
            <input type="text" class="form-control"
                   [(ngModel)]="nouveauMembre"
                   placeholder="Ajouter un membre..."
                   (keyup.enter)="ajouterMembre()" />
            <button class="btn btn-secondary btn-sm" (click)="ajouterMembre()">
              Ajouter
            </button>
          </div>
        </div>

        <!-- ============================
             TABLEAU KANBAN DES TÂCHES
             ============================ -->
        <div class="section-card">
          <app-task-board
            [projet]="projet()!"
            (projetMisAJour)="onProjetMisAJour($event)">
          </app-task-board>
        </div>

      </div>
    }
  `,
  styles: [`
    .details-container { max-width: 1200px; margin: 0 auto; }
    .projet-header {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .header-info { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
    .header-info h2 { margin: 0; color: #2c3e50; flex: 1; }
    .btn-retour {
      background: #ecf0f1;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      white-space: nowrap;
    }
    .badge-statut { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    .statut-en_cours { background: #e3f2fd; color: #1565c0; }
    .statut-terminé { background: #e8f5e9; color: #2e7d32; }
    .statut-en_retard { background: #ffebee; color: #c62828; }
    .avancement-bloc { }
    .avancement-texte { font-size: 14px; color: #555; margin-bottom: 8px; }
    .barre-avancement { background: #ecf0f1; border-radius: 8px; height: 14px; overflow: hidden; }
    .fill-avancement {
      height: 100%;
      background: linear-gradient(90deg, #4a6fa5, #74b9ff);
      border-radius: 8px;
      transition: width 0.6s ease;
    }
    .fill-avancement.complet { background: linear-gradient(90deg, #27ae60, #2ecc71); }
    .section-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .section-card h3 { margin: 0 0 16px; color: #2c3e50; }
    .info-grille { display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 12px; }
    .info-item { display: flex; flex-direction: column; }
    .info-label { font-size: 11px; color: #95a5a6; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-valeur { font-size: 15px; font-weight: 600; color: #2c3e50; margin-top: 2px; }
    .info-valeur.retard { color: #e74c3c; }
    .description { color: #555; font-size: 14px; margin-top: 12px; line-height: 1.6; }
    .membres-liste { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
    .badge-membre {
      background: #e3f2fd;
      color: #1565c0;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
    }
    .vide-msg { color: #bdc3c7; font-style: italic; }
    .ajout-membre { display: flex; gap: 8px; }
    .form-control {
      flex: 1;
      padding: 8px 12px;
      border: 2px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
    }
    .form-control:focus { outline: none; border-color: #4a6fa5; }
    .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .btn-secondary { background: #ecf0f1; color: #555; }
    .btn-sm { font-size: 13px; }
    .chargement { text-align: center; padding: 60px; color: #7f8c8d; font-size: 16px; }
  `]
})
export class ProjectDetailsComponent implements OnInit {

  private projetService = inject(ProjetService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /** Signal contenant le projet chargé */
  projet = signal<Projet | null>(null);

  /** Signal de chargement */
  chargement = signal(true);

  /** Champ pour ajouter un nouveau membre */
  nouveauMembre = '';

  /**
   * Au chargement du composant, récupère l'ID depuis l'URL
   * et charge le projet correspondant.
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chargerProjet(id);
    }
  }

  /**
   * Charge le projet depuis le backend via le service.
   *
   * @param id l'identifiant du projet
   */
  chargerProjet(id: string): void {
    this.chargement.set(true);
    this.projetService.getProjetParId(id).subscribe({
      next: (data) => {
        this.projet.set(data);
        this.chargement.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement projet:', err);
        this.chargement.set(false);
        this.router.navigate(['/projets']); // Rediriger si projet inexistant
      }
    });
  }

  /**
   * Appelé par le TaskBoardComponent quand le projet est mis à jour.
   * Met à jour le signal local avec les nouvelles données (dont l'avancement).
   *
   * @param projetMisAJour le projet avec l'avancement recalculé
   */
  onProjetMisAJour(projetMisAJour: Projet): void {
    this.projet.set(projetMisAJour);
  }

  /**
   * Ajoute un membre au groupe du projet via le service.
   */
  ajouterMembre(): void {
    const membre = this.nouveauMembre.trim();
    if (!membre || !this.projet()?.id) return;

    this.projetService.ajouterMembre(this.projet()!.id!, membre).subscribe({
      next: (projetMisAJour) => {
        this.projet.set(projetMisAJour);
        this.nouveauMembre = ''; // Vider le champ
      },
      error: (err) => console.error('Erreur ajout membre:', err)
    });
  }

  /**
   * Calcule le nombre de tâches terminées (statut DONE).
   * Utilisé pour l'affichage "X/N tâches terminées".
   */
  getTachesTerminees(): number {
    return this.projet()?.taches?.filter(t => t.statut === 'DONE').length || 0;
  }

  /**
   * Retourne la classe CSS correspondant au statut du projet.
   */
  getClassStatut(statut: string): string {
    const classes: Record<string, string> = {
      'EN_COURS': 'statut-en_cours',
      'TERMINÉ': 'statut-terminé',
      'EN_RETARD': 'statut-en_retard'
    };
    return classes[statut] || 'statut-en_cours';
  }
}
