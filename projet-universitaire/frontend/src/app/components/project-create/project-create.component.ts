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
      <div class="form-card">
        <h2>➕ Créer un Nouveau Projet</h2>
        <p class="sous-titre">Remplissez les informations de votre projet universitaire</p>

        <!-- Indicateur de soumission réussie -->
        @if (soumis()) {
          <div class="alert-success">✅ Projet créé avec succès ! Redirection en cours...</div>
        }

        <!-- Indicateur d'erreur -->
        @if (erreur()) {
          <div class="alert-error">❌ Erreur : {{ erreur() }}</div>
        }

        <!-- ============================
             CHAMPS DU FORMULAIRE
             ============================ -->
        <div class="form-group">
          <label for="titre">Titre du projet *</label>
          <input type="text" id="titre" class="form-control"
                 [(ngModel)]="projet.titre"
                 placeholder="Ex : Plateforme de gestion universitaire"
                 required />
        </div>

        <div class="form-group">
          <label for="matiere">Matière / Module</label>
          <input type="text" id="matiere" class="form-control"
                 [(ngModel)]="projet.matiere"
                 placeholder="Ex : Ingénierie des services numériques" />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" class="form-control" rows="4"
                    [(ngModel)]="projet.description"
                    placeholder="Décrivez brièvement le projet..."></textarea>
        </div>

        <div class="form-group">
          <label for="dateLimite">Date limite de rendu</label>
          <input type="date" id="dateLimite" class="form-control"
                 [(ngModel)]="projet.dateLimite" />
        </div>

        <!-- ============================
             AJOUT DES MEMBRES DU GROUPE
             ============================ -->
        <div class="form-group">
          <label>Membres du groupe</label>
          <div class="ajout-membre">
            <input type="text" class="form-control"
                   [(ngModel)]="nouveauMembre"
                   placeholder="Nom ou email du membre"
                   (keyup.enter)="ajouterMembre()" />
            <button class="btn btn-secondary" type="button" (click)="ajouterMembre()">
              Ajouter
            </button>
          </div>
          <!-- Liste des membres ajoutés -->
          <div class="liste-membres">
            @for (membre of projet.membres; track membre) {
              <span class="badge-membre">
                👤 {{ membre }}
                <button class="suppr-membre" (click)="supprimerMembre(membre)">✕</button>
              </span>
            }
          </div>
        </div>

        <!-- ============================
             BOUTONS D'ACTION
             ============================ -->
        <div class="actions">
          <button class="btn btn-secondary" routerLink="/projets">
            ← Annuler
          </button>
          <button class="btn btn-primary"
                  [disabled]="!projet.titre || enCours()"
                  (click)="soumettre()">
            @if (enCours()) {
              ⏳ Création...
            } @else {
              ✅ Créer le projet
            }
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .create-container {
      max-width: 700px;
      margin: 0 auto;
    }
    .form-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.1);
    }
    h2 { color: #2c3e50; margin-bottom: 8px; }
    .sous-titre { color: #7f8c8d; margin-bottom: 24px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; font-weight: 600; margin-bottom: 6px; color: #2c3e50; }
    .form-control {
      width: 100%;
      padding: 10px 14px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .form-control:focus { outline: none; border-color: #4a6fa5; }
    .ajout-membre { display: flex; gap: 8px; }
    .ajout-membre .form-control { flex: 1; }
    .liste-membres { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .badge-membre {
      background: #e3f2fd;
      color: #1565c0;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .suppr-membre {
      background: none;
      border: none;
      color: #e74c3c;
      cursor: pointer;
      font-size: 14px;
      padding: 0;
    }
    .actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
    .btn { padding: 10px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 600; }
    .btn-primary { background: #4a6fa5; color: white; }
    .btn-primary:disabled { background: #b0bec5; cursor: not-allowed; }
    .btn-secondary { background: #ecf0f1; color: #555; }
    .alert-success { background: #e8f5e9; color: #2e7d32; padding: 12px; border-radius: 8px; margin-bottom: 16px; }
    .alert-error { background: #ffebee; color: #c62828; padding: 12px; border-radius: 8px; margin-bottom: 16px; }
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
