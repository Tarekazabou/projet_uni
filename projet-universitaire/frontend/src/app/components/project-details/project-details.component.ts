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
      <div class="chargement">
        <div class="loader"></div>
        <p>Chargement du projet...</p>
      </div>
    }

    <!-- Contenu principal -->
    @if (projet()) {
      <div class="details-container">

        <!-- Breadcrumb -->
        <div class="breadcrumb animate-fade-in">
          <a routerLink="/projets" class="breadcrumb-link">← Retour aux projets</a>
        </div>

        <!-- ============================
             EN-TÊTE DU PROJET
             ============================ -->
        <div class="projet-header animate-fade-in-up">
          <div class="header-top">
            <div class="header-info">
              <div class="titre-row">
                <h1 class="projet-titre">{{ projet()!.titre }}</h1>
                <span class="badge-statut" [ngClass]="getClassStatut(projet()!.statut)">
                  {{ getStatutLabel(projet()!.statut) }}
                </span>
              </div>
              @if (projet()!.matiere) {
                <p class="projet-matiere">📖 {{ projet()!.matiere }}</p>
              }
            </div>
          </div>

          <!-- Barre d'avancement globale -->
          <div class="avancement-bloc">
            <div class="avancement-header">
              <span class="avancement-label">Avancement global</span>
              <span class="avancement-value">
                <strong>{{ projet()!.avancement | number:'1.0-0' }}%</strong>
                <span class="avancement-detail">{{ getTachesTerminees() }}/{{ projet()!.taches.length }} tâches</span>
              </span>
            </div>
            <div class="barre-avancement">
              <div class="fill-avancement"
                   [style.width.%]="projet()!.avancement"
                   [class.complet]="projet()!.avancement >= 100"
                   [class.retard]="projet()!.statut === 'EN_RETARD'">
              </div>
            </div>
          </div>
        </div>

        <!-- ============================
             3-COLUMN STATS
             ============================ -->
        <div class="info-cards animate-fade-in-up stagger-1">
          <div class="info-card">
            <span class="info-card-icon">📅</span>
            <span class="info-card-label">Création</span>
            <span class="info-card-value">{{ projet()!.dateCreation | date:'dd MMM yyyy' }}</span>
          </div>
          <div class="info-card" [class.danger]="projet()!.statut === 'EN_RETARD'">
            <span class="info-card-icon">⏰</span>
            <span class="info-card-label">Date limite</span>
            <span class="info-card-value">
              {{ projet()!.dateLimite ? (projet()!.dateLimite | date:'dd MMM yyyy') : 'Non définie' }}
            </span>
          </div>
          <div class="info-card">
            <span class="info-card-icon">👥</span>
            <span class="info-card-label">Membres</span>
            <span class="info-card-value">{{ projet()!.membres?.length || 0 }} personne(s)</span>
          </div>
        </div>

        <!-- ============================
             DESCRIPTION
             ============================ -->
        @if (projet()!.description) {
          <div class="section-card animate-fade-in-up stagger-2">
            <h3 class="section-title">📋 Description</h3>
            <p class="description-text">{{ projet()!.description }}</p>
          </div>
        }

        <!-- ============================
             MEMBRES DU GROUPE
             ============================ -->
        <div class="section-card animate-fade-in-up stagger-3">
          <h3 class="section-title">👥 Équipe du projet</h3>
          <div class="membres-grid">
            @for (membre of projet()!.membres; track membre; let i = $index) {
              <div class="membre-card" [style.animation-delay]="(i * 0.05) + 's'">
                <div class="membre-avatar-lg">{{ membre.charAt(0).toUpperCase() }}</div>
                <span class="membre-name">{{ membre }}</span>
              </div>
            }
            @if (!projet()!.membres?.length) {
              <p class="empty-msg">Aucun membre ajouté</p>
            }
          </div>

          <!-- Formulaire d'ajout de membre -->
          <div class="ajout-membre">
            <div class="input-wrapper">
              <input type="text" class="form-control"
                     [(ngModel)]="nouveauMembre"
                     placeholder="Ajouter un membre..."
                     (keyup.enter)="ajouterMembre()" />
              <span class="input-icon">👤</span>
            </div>
            <button class="btn btn-secondary" (click)="ajouterMembre()">
              Ajouter
            </button>
          </div>
        </div>

        <!-- ============================
             TABLEAU KANBAN DES TÂCHES
             ============================ -->
        <div class="section-card animate-fade-in-up stagger-4">
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

    /* Breadcrumb */
    .breadcrumb { margin-bottom: 16px; }
    .breadcrumb-link {
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 500;
      transition: color var(--transition-fast);
    }
    .breadcrumb-link:hover { color: var(--primary); }

    /* Header */
    .projet-header {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: 32px;
      margin-bottom: 20px;
      box-shadow: var(--shadow-md);
      border: 1px solid rgba(0,0,0,0.04);
      position: relative;
      overflow: hidden;
    }
    .projet-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--gradient-primary);
    }
    .header-top { margin-bottom: 24px; }
    .titre-row {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      flex-wrap: wrap;
    }
    .projet-titre {
      font-size: 26px;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
      flex: 1;
      letter-spacing: -0.5px;
    }
    .projet-matiere {
      color: var(--text-muted);
      font-size: 14px;
      margin: 6px 0 0;
      font-weight: 500;
    }

    .badge-statut {
      padding: 6px 16px;
      border-radius: var(--radius-full);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .statut-en_cours { background: #e8f4fd; color: #1976d2; }
    .statut-terminé { background: #e6f9f0; color: #0d9058; }
    .statut-en_retard { background: #fde8ed; color: #c0392b; }

    /* Avancement */
    .avancement-bloc { }
    .avancement-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .avancement-label { font-size: 14px; color: var(--text-secondary); font-weight: 500; }
    .avancement-value { font-size: 14px; color: var(--text-primary); }
    .avancement-value strong { font-size: 20px; color: var(--primary); }
    .avancement-detail { color: var(--text-muted); margin-left: 6px; font-size: 13px; }
    .barre-avancement {
      background: #f0f2f5;
      border-radius: var(--radius-full);
      height: 12px;
      overflow: hidden;
    }
    .fill-avancement {
      height: 100%;
      background: var(--gradient-primary);
      border-radius: var(--radius-full);
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .fill-avancement::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shimmer 2s infinite;
      background-size: 200% 100%;
    }
    .fill-avancement.complet { background: var(--gradient-success); }
    .fill-avancement.retard { background: var(--gradient-accent); }

    /* Info Cards */
    .info-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }
    .info-card {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-shadow: var(--shadow-sm);
      border: 1px solid rgba(0,0,0,0.04);
      transition: all var(--transition-normal);
    }
    .info-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
    .info-card.danger { border-color: rgba(239, 71, 111, 0.2); }
    .info-card.danger .info-card-value { color: var(--danger); }
    .info-card-icon { font-size: 28px; margin-bottom: 8px; }
    .info-card-label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-bottom: 4px; }
    .info-card-value { font-size: 15px; font-weight: 700; color: var(--text-primary); }

    /* Section Card */
    .section-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: 28px;
      margin-bottom: 20px;
      box-shadow: var(--shadow-sm);
      border: 1px solid rgba(0,0,0,0.04);
    }
    .section-title {
      margin: 0 0 20px;
      color: var(--text-primary);
      font-size: 18px;
      font-weight: 700;
    }
    .description-text {
      color: var(--text-secondary);
      font-size: 15px;
      line-height: 1.7;
      margin: 0;
    }

    /* Membres */
    .membres-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 20px;
    }
    .membre-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 18px;
      background: #f8f9fb;
      border-radius: var(--radius-full);
      animation: scaleIn 0.3s ease-out both;
      transition: all var(--transition-normal);
    }
    .membre-card:hover { background: #eef1f5; transform: translateY(-2px); }
    .membre-avatar-lg {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--gradient-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
    }
    .membre-name { font-size: 14px; font-weight: 500; color: var(--text-primary); }
    .empty-msg { color: var(--text-muted); font-style: italic; font-size: 14px; }

    /* Add Member */
    .ajout-membre { display: flex; gap: 10px; }
    .input-wrapper { position: relative; flex: 1; }
    .input-icon {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      pointer-events: none;
      opacity: 0.5;
    }
    .form-control {
      width: 100%;
      padding: 12px 16px;
      padding-right: 42px;
      border: 2px solid #e8ecf1;
      border-radius: var(--radius-md);
      font-size: 14px;
      transition: all var(--transition-normal);
      background: #fafbfc;
      font-family: inherit;
    }
    .form-control:focus {
      outline: none;
      border-color: var(--primary);
      background: white;
      box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.1);
    }
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      transition: all var(--transition-normal);
      font-family: inherit;
    }
    .btn-secondary { background: #f0f2f5; color: var(--text-secondary); }
    .btn-secondary:hover { background: #e4e7eb; }

    /* Loading */
    .chargement {
      text-align: center;
      padding: 100px 20px;
      color: var(--text-muted);
      animation: fadeIn 0.5s ease;
    }
    .loader {
      width: 44px;
      height: 44px;
      border: 3px solid #f0f2f5;
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .info-cards { grid-template-columns: 1fr; }
      .projet-titre { font-size: 20px; }
      .section-card { padding: 20px; }
      .projet-header { padding: 24px; }
    }
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

  /**
   * Retourne le libellé d'affichage du statut.
   */
  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      'EN_COURS': 'En cours',
      'TERMINÉ': 'Terminé',
      'EN_RETARD': 'En retard'
    };
    return labels[statut] || statut;
  }
}
