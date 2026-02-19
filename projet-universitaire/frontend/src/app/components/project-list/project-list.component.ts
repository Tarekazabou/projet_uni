/**
 * ============================================================
 * COMPOSANT : ProjectListComponent
 * ============================================================
 * Affiche la liste de tous les projets universitaires.
 * Permet de :
 *   - Voir tous les projets avec leur avancement
 *   - Filtrer par statut (EN_COURS / TERMINÉ / EN_RETARD)
 *   - Accéder aux détails d'un projet
 *   - Supprimer un projet
 * ============================================================
 */
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProjetService } from '../../services/projet.service';
import { Projet } from '../../models/projet.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- ============================
         EN-TÊTE DE LA PAGE
         ============================ -->
    <div class="page-header">
      <h2>📚 Mes Projets Universitaires</h2>
      <button class="btn btn-primary" routerLink="/projets/nouveau">
        ➕ Nouveau Projet
      </button>
    </div>

    <!-- ============================
         FILTRES PAR STATUT
         ============================ -->
    <div class="filtres">
      <button class="filtre-btn" [class.actif]="filtreActif() === 'TOUS'"
              (click)="filtrerProjets('TOUS')">
        Tous ({{ projets().length }})
      </button>
      <button class="filtre-btn en-cours" [class.actif]="filtreActif() === 'EN_COURS'"
              (click)="filtrerProjets('EN_COURS')">
        🔵 En Cours
      </button>
      <button class="filtre-btn terminé" [class.actif]="filtreActif() === 'TERMINÉ'"
              (click)="filtrerProjets('TERMINÉ')">
        ✅ Terminés
      </button>
      <button class="filtre-btn retard" [class.actif]="filtreActif() === 'EN_RETARD'"
              (click)="filtrerProjets('EN_RETARD')">
        🔴 En Retard
      </button>
    </div>

    <!-- ============================
         MESSAGE DE CHARGEMENT
         ============================ -->
    @if (chargement()) {
      <div class="chargement">⏳ Chargement des projets...</div>
    }

    <!-- ============================
         MESSAGE SI AUCUN PROJET
         ============================ -->
    @if (!chargement() && projetsFiltres().length === 0) {
      <div class="vide">
        <p>📭 Aucun projet trouvé.</p>
        <button class="btn btn-primary" routerLink="/projets/nouveau">
          Créer votre premier projet
        </button>
      </div>
    }

    <!-- ============================
         GRILLE DES PROJETS
         ============================ -->
    <div class="projets-grille">
      @for (projet of projetsFiltres(); track projet.id) {
        <div class="carte-projet" [class.retard]="projet.statut === 'EN_RETARD'">

          <!-- Statut badge -->
          <div class="badge-statut" [ngClass]="getClassStatut(projet.statut)">
            {{ projet.statut }}
          </div>

          <!-- Titre et matière -->
          <h3>{{ projet.titre }}</h3>
          <p class="matiere">📖 {{ projet.matiere || 'Matière non précisée' }}</p>
          <p class="description">{{ projet.description }}</p>

          <!-- Membres du groupe -->
          <div class="membres">
            👥 {{ projet.membres?.length || 0 }} membre(s)
          </div>

          <!-- Barre de progression (avancement) -->
          <div class="avancement-section">
            <div class="avancement-label">
              Avancement : <strong>{{ projet.avancement | number:'1.0-0' }}%</strong>
            </div>
            <div class="barre-progression">
              <div class="progression-fill"
                   [style.width.%]="projet.avancement"
                   [class.terminé]="projet.avancement >= 100">
              </div>
            </div>
          </div>

          <!-- Date limite -->
          @if (projet.dateLimite) {
            <div class="date-limite" [class.depassee]="projet.statut === 'EN_RETARD'">
              📅 Limite : {{ projet.dateLimite | date:'dd/MM/yyyy' }}
            </div>
          }

          <!-- Actions -->
          <div class="actions">
            <button class="btn btn-info btn-sm" (click)="voirDetails(projet.id!)">
              👁 Détails
            </button>
            <button class="btn btn-danger btn-sm" (click)="supprimerProjet(projet.id!)">
              🗑 Supprimer
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .filtres {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .filtre-btn {
      padding: 8px 16px;
      border: 2px solid #ddd;
      background: white;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }
    .filtre-btn.actif, .filtre-btn:hover { background: #4a6fa5; color: white; border-color: #4a6fa5; }
    .projets-grille {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }
    .carte-projet {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-left: 4px solid #4a6fa5;
      position: relative;
      transition: transform 0.2s;
    }
    .carte-projet:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
    .carte-projet.retard { border-left-color: #e74c3c; }
    .badge-statut {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
    }
    .statut-en_cours { background: #e3f2fd; color: #1565c0; }
    .statut-terminé { background: #e8f5e9; color: #2e7d32; }
    .statut-en_retard { background: #ffebee; color: #c62828; }
    .carte-projet h3 { margin: 0 0 8px; color: #2c3e50; font-size: 18px; padding-right: 80px; }
    .matiere { color: #7f8c8d; font-size: 13px; margin: 0 0 8px; }
    .description { color: #555; font-size: 14px; margin: 0 0 12px; }
    .membres { color: #7f8c8d; font-size: 13px; margin-bottom: 12px; }
    .avancement-section { margin: 12px 0; }
    .avancement-label { font-size: 13px; color: #555; margin-bottom: 6px; }
    .barre-progression {
      background: #ecf0f1;
      border-radius: 8px;
      height: 10px;
      overflow: hidden;
    }
    .progression-fill {
      height: 100%;
      background: linear-gradient(90deg, #4a6fa5, #74b9ff);
      border-radius: 8px;
      transition: width 0.5s ease;
    }
    .progression-fill.terminé { background: linear-gradient(90deg, #27ae60, #2ecc71); }
    .date-limite { font-size: 12px; color: #7f8c8d; margin: 8px 0; }
    .date-limite.depassee { color: #e74c3c; font-weight: bold; }
    .actions { display: flex; gap: 8px; margin-top: 12px; }
    .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
    .btn-primary { background: #4a6fa5; color: white; }
    .btn-info { background: #3498db; color: white; }
    .btn-danger { background: #e74c3c; color: white; }
    .btn-sm { padding: 6px 12px; font-size: 12px; }
    .chargement, .vide { text-align: center; padding: 40px; color: #7f8c8d; font-size: 16px; }
  `]
})
export class ProjectListComponent implements OnInit {

  /** Service injecté pour accéder aux données */
  private projetService = inject(ProjetService);
  private router = inject(Router);

  /** Signal contenant la liste complète des projets */
  projets = signal<Projet[]>([]);

  /** Signal contenant la liste filtrée affichée */
  projetsFiltres = signal<Projet[]>([]);

  /** Signal indiquant si les données sont en cours de chargement */
  chargement = signal<boolean>(false);

  /** Signal indiquant le filtre actif */
  filtreActif = signal<string>('TOUS');

  /**
   * Lifecycle hook Angular : exécuté au chargement du composant.
   * Lance le chargement initial des projets.
   */
  ngOnInit(): void {
    this.chargerProjets();
  }

  /**
   * Charge tous les projets depuis le backend via le service.
   * Met à jour les signaux projets et projetsFiltres.
   */
  chargerProjets(): void {
    this.chargement.set(true);
    this.projetService.getTousLesProjets().subscribe({
      next: (data) => {
        this.projets.set(data);
        this.projetsFiltres.set(data); // Afficher tous au départ
        this.chargement.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des projets:', err);
        this.chargement.set(false);
      }
    });
  }

  /**
   * Filtre la liste des projets par statut.
   *
   * @param statut 'TOUS', 'EN_COURS', 'TERMINÉ', 'EN_RETARD'
   */
  filtrerProjets(statut: string): void {
    this.filtreActif.set(statut);
    if (statut === 'TOUS') {
      // Afficher tous les projets sans filtre
      this.projetsFiltres.set(this.projets());
    } else {
      // Filtrer par statut
      const filtres = this.projets().filter(p => p.statut === statut);
      this.projetsFiltres.set(filtres);
    }
  }

  /**
   * Navigue vers la page de détails d'un projet.
   *
   * @param id l'identifiant du projet
   */
  voirDetails(id: string): void {
    this.router.navigate(['/projets', id]);
  }

  /**
   * Supprime un projet après confirmation de l'utilisateur.
   * Rafraîchit la liste après suppression.
   *
   * @param id l'identifiant du projet à supprimer
   */
  supprimerProjet(id: string): void {
    // Demander confirmation avant de supprimer
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.')) {
      this.projetService.supprimerProjet(id).subscribe({
        next: () => {
          // Recharger la liste après suppression
          this.chargerProjets();
        },
        error: (err) => console.error('Erreur lors de la suppression:', err)
      });
    }
  }

  /**
   * Retourne la classe CSS correspondant au statut d'un projet.
   * Utilisée pour afficher le badge coloré.
   *
   * @param statut le statut du projet
   * @returns la classe CSS correspondante
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
