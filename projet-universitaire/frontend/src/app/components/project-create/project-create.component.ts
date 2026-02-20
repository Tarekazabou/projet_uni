/**
 * ============================================================
 * COMPOSANT : ProjectCreateComponent
 * ============================================================
 * Formulaire de création d'un nouveau projet universitaire.
 * Permet de renseigner :
 *   - Titre, description, matière
 *   - Date limite
 *   - Membres du groupe
 * ============================================================
 */
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProjetService } from '../../services/projet.service';
import { Projet } from '../../models/projet.model';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <!-- ============================
         FORMULAIRE DE CRÉATION
         ============================ -->
    <div class="create-container">
      <!-- Breadcrumb -->
      <div class="breadcrumb animate-fade-in">
        <a routerLink="/projets" class="breadcrumb-link">← Retour aux projets</a>
      </div>

      <div class="form-card animate-fade-in-up">
        <!-- Header with icon -->
        <div class="form-header">
          <div class="header-icon">✨</div>
          <div>
            <h2>Créer un Nouveau Projet</h2>
            <p class="sous-titre">Remplissez les informations de votre projet universitaire</p>
          </div>
        </div>

        <!-- Progress indicator -->
        <div class="form-progress">
          <div class="progress-step" [class.active]="true" [class.done]="projet.titre">
            <span class="step-dot">1</span>
            <span class="step-label">Infos</span>
          </div>
          <div class="progress-line" [class.active]="projet.titre"></div>
          <div class="progress-step" [class.active]="projet.titre" [class.done]="projet.description">
            <span class="step-dot">2</span>
            <span class="step-label">Détails</span>
          </div>
          <div class="progress-line" [class.active]="projet.description"></div>
          <div class="progress-step" [class.active]="projet.description" [class.done]="projet.membres.length > 0">
            <span class="step-dot">3</span>
            <span class="step-label">Équipe</span>
          </div>
        </div>

        <!-- Indicateur de soumission réussie -->
        @if (soumis()) {
          <div class="alert alert-success animate-scale-in">
            <span class="alert-icon">🎉</span>
            <div>
              <strong>Projet créé avec succès !</strong>
              <p>Redirection vers votre projet...</p>
            </div>
          </div>
        }

        <!-- Indicateur d'erreur -->
        @if (erreur()) {
          <div class="alert alert-error animate-scale-in">
            <span class="alert-icon">⚠️</span>
            <div>
              <strong>Erreur</strong>
              <p>{{ erreur() }}</p>
            </div>
          </div>
        }

        <!-- ============================
             CHAMPS DU FORMULAIRE
             ============================ -->
        <div class="form-section">
          <h3 class="section-title">📝 Informations principales</h3>

          <div class="form-group">
            <label for="titre">Titre du projet <span class="required">*</span></label>
            <div class="input-wrapper">
              <input type="text" id="titre" class="form-control"
                     [(ngModel)]="projet.titre"
                     placeholder="Ex : Plateforme de gestion universitaire"
                     required />
              <span class="input-icon">📌</span>
            </div>
          </div>

          <div class="form-group">
            <label for="matiere">Matière / Module</label>
            <div class="input-wrapper">
              <input type="text" id="matiere" class="form-control"
                     [(ngModel)]="projet.matiere"
                     placeholder="Ex : Ingénierie des services numériques" />
              <span class="input-icon">📖</span>
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" class="form-control textarea" rows="4"
                      [(ngModel)]="projet.description"
                      placeholder="Décrivez brièvement le projet..."></textarea>
          </div>

          <div class="form-group">
            <label for="dateLimite">Date limite de rendu</label>
            <div class="input-wrapper">
              <input type="date" id="dateLimite" class="form-control"
                     [(ngModel)]="projet.dateLimite" />
              <span class="input-icon">📅</span>
            </div>
          </div>
        </div>

        <!-- ============================
             AJOUT DES MEMBRES DU GROUPE
             ============================ -->
        <div class="form-section">
          <h3 class="section-title">👥 Membres du groupe</h3>

          <div class="ajout-membre">
            <div class="input-wrapper" style="flex:1">
              <input type="text" class="form-control"
                     [(ngModel)]="nouveauMembre"
                     placeholder="Nom ou email du membre"
                     (keyup.enter)="ajouterMembre()" />
              <span class="input-icon">👤</span>
            </div>
            <button class="btn btn-secondary" type="button" (click)="ajouterMembre()">
              Ajouter
            </button>
          </div>

          <!-- Liste des membres ajoutés -->
          <div class="liste-membres">
            @for (membre of projet.membres; track membre; let i = $index) {
              <span class="badge-membre" [style.animation-delay]="(i * 0.05) + 's'">
                <span class="membre-avatar">{{ membre.charAt(0).toUpperCase() }}</span>
                {{ membre }}
                <button class="suppr-membre" (click)="supprimerMembre(membre)">✕</button>
              </span>
            }
            @if (projet.membres.length === 0) {
              <p class="empty-hint">Aucun membre ajouté pour le moment</p>
            }
          </div>
        </div>

        <!-- ============================
             BOUTONS D'ACTION
             ============================ -->
        <div class="actions">
          <button class="btn btn-ghost" routerLink="/projets">
            ← Annuler
          </button>
          <button class="btn btn-primary btn-glow"
                  [disabled]="!projet.titre || enCours()"
                  (click)="soumettre()">
            @if (enCours()) {
              <span class="spinner-small"></span> Création...
            } @else {
              ✨ Créer le projet
            }
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .create-container {
      max-width: 720px;
      margin: 0 auto;
    }
    .breadcrumb { margin-bottom: 16px; }
    .breadcrumb-link {
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 500;
      transition: color var(--transition-fast);
    }
    .breadcrumb-link:hover { color: var(--primary); }

    .form-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: 40px;
      box-shadow: var(--shadow-md);
      border: 1px solid rgba(0,0,0,0.04);
    }

    /* Header */
    .form-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
    }
    .header-icon {
      width: 56px;
      height: 56px;
      background: var(--gradient-primary);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
    }
    h2 { color: var(--text-primary); margin: 0 0 4px; font-size: 22px; font-weight: 700; }
    .sous-titre { color: var(--text-muted); margin: 0; font-size: 14px; }

    /* Progress Steps */
    .form-progress {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      margin-bottom: 32px;
      padding: 20px;
      background: #f8f9fb;
      border-radius: var(--radius-md);
    }
    .progress-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .step-dot {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #e0e0e0;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      transition: all var(--transition-normal);
    }
    .progress-step.active .step-dot { background: #e8f4fd; color: var(--primary); }
    .progress-step.done .step-dot { background: var(--gradient-primary); color: white; }
    .step-label { font-size: 11px; color: var(--text-muted); font-weight: 500; }
    .progress-line {
      width: 60px;
      height: 3px;
      background: #e0e0e0;
      border-radius: 2px;
      margin: 0 12px;
      margin-bottom: 20px;
      transition: background var(--transition-normal);
    }
    .progress-line.active { background: var(--gradient-primary); }

    /* Alerts */
    .alert {
      padding: 16px 20px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 24px;
    }
    .alert-icon { font-size: 24px; }
    .alert strong { display: block; margin-bottom: 2px; }
    .alert p { margin: 0; font-size: 13px; opacity: 0.8; }
    .alert-success {
      background: linear-gradient(135deg, #e6f9f0, #d4f5e4);
      color: #0d9058;
      border: 1px solid rgba(6, 214, 160, 0.2);
    }
    .alert-error {
      background: linear-gradient(135deg, #fde8ed, #fdd);
      color: #c0392b;
      border: 1px solid rgba(239, 71, 111, 0.2);
    }

    /* Sections */
    .form-section {
      margin-bottom: 28px;
      padding-bottom: 28px;
      border-bottom: 1px solid #f0f2f5;
    }
    .form-section:last-of-type { border-bottom: none; }
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 20px;
    }

    .form-group { margin-bottom: 20px; }
    label {
      display: block;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--text-primary);
      font-size: 14px;
    }
    .required { color: var(--danger); }

    .input-wrapper {
      position: relative;
    }
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
      box-sizing: border-box;
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
    .form-control::placeholder { color: var(--text-muted); }
    .textarea { padding-right: 16px; resize: vertical; min-height: 100px; }

    /* Membres */
    .ajout-membre { display: flex; gap: 10px; margin-bottom: 16px; }
    .liste-membres { display: flex; flex-wrap: wrap; gap: 10px; }
    .badge-membre {
      background: linear-gradient(135deg, #e8f4fd, #dce8f5);
      color: var(--primary);
      padding: 8px 14px;
      border-radius: var(--radius-full);
      font-size: 13px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: scaleIn 0.3s ease-out both;
      transition: all var(--transition-normal);
    }
    .badge-membre:hover { transform: translateY(-2px); box-shadow: var(--shadow-sm); }
    .membre-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--gradient-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
    }
    .suppr-membre {
      background: none;
      border: none;
      color: var(--danger);
      cursor: pointer;
      font-size: 14px;
      padding: 0;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
    }
    .suppr-membre:hover { background: rgba(239, 71, 111, 0.15); }
    .empty-hint { color: var(--text-muted); font-size: 13px; font-style: italic; }

    /* Actions */
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #f0f2f5;
    }

    /* Buttons */
    .btn {
      padding: 12px 28px;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      transition: all var(--transition-normal);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: inherit;
    }
    .btn-primary {
      background: var(--gradient-primary);
      color: white;
      box-shadow: 0 4px 15px rgba(67, 97, 238, 0.25);
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(67, 97, 238, 0.35);
    }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .btn-secondary {
      background: #f0f2f5;
      color: var(--text-secondary);
      font-weight: 600;
    }
    .btn-secondary:hover { background: #e4e7eb; }
    .btn-ghost {
      background: transparent;
      color: var(--text-secondary);
    }
    .btn-ghost:hover { background: #f0f2f5; }
    .btn-glow { position: relative; overflow: hidden; }
    .btn-glow::after {
      content: '';
      position: absolute;
      inset: -50%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
      animation: shimmer 3s infinite;
      background-size: 200% 100%;
    }

    /* Spinner */
    .spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .form-card { padding: 24px 20px; }
      .form-progress { display: none; }
    }
  `]
})
export class ProjectCreateComponent {

  private projetService = inject(ProjetService);
  private router = inject(Router);

  /** Modèle du nouveau projet à créer */
  projet: Projet = {
    titre: '',
    description: '',
    matiere: '',
    dateLimite: '',
    membres: [],
    taches: [],
    avancement: 0,
    statut: 'EN_COURS'
  };

  /** Champ pour ajouter un nouveau membre */
  nouveauMembre = '';

  /** Signaux pour l'état du formulaire */
  soumis = signal(false);
  enCours = signal(false);
  erreur = signal('');

  /**
   * Ajoute un membre à la liste du groupe.
   * Vérifie que le champ n'est pas vide et que le membre n'existe pas déjà.
   */
  ajouterMembre(): void {
    const membre = this.nouveauMembre.trim();
    if (membre && !this.projet.membres.includes(membre)) {
      this.projet.membres.push(membre);
      this.nouveauMembre = ''; // Vider le champ après ajout
    }
  }

  /**
   * Supprime un membre de la liste du groupe.
   *
   * @param membre le membre à supprimer
   */
  supprimerMembre(membre: string): void {
    this.projet.membres = this.projet.membres.filter(m => m !== membre);
  }

  /**
   * Soumet le formulaire et crée le projet via le service.
   * Redirige vers la liste des projets après création réussie.
   */
  soumettre(): void {
    if (!this.projet.titre.trim()) return;

    this.enCours.set(true);
    this.erreur.set('');

    this.projetService.creerProjet(this.projet).subscribe({
      next: (projetCree) => {
        this.soumis.set(true);
        this.enCours.set(false);
        // Rediriger vers la page de détails du projet créé après 1.5s
        setTimeout(() => {
          this.router.navigate(['/projets', projetCree.id]);
        }, 1500);
      },
      error: (err) => {
        this.erreur.set(err.message || 'Une erreur est survenue lors de la création.');
        this.enCours.set(false);
      }
    });
  }
}
