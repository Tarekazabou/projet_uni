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
    <div class="page-header animate-fade-in-up">
      <div class="header-left">
        <h1 class="page-title">📚 Mes Projets</h1>
        <p class="page-subtitle">Gérez vos projets universitaires en un seul endroit</p>
      </div>
      <button class="btn btn-primary btn-glow" routerLink="/projets/nouveau">
        <span class="btn-icon">✨</span>
        Nouveau Projet
      </button>
    </div>

    <!-- ============================
         STATISTIQUES RAPIDES
         ============================ -->
    <div class="stats-bar animate-fade-in-up stagger-1">
      <div class="stat-chip">
        <span class="stat-number">{{ projets().length }}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-chip en-cours">
        <span class="stat-number">{{ getCount('EN_COURS') }}</span>
        <span class="stat-label">En Cours</span>
      </div>
      <div class="stat-chip termine">
        <span class="stat-number">{{ getCount('TERMINÉ') }}</span>
        <span class="stat-label">Terminés</span>
      </div>
      <div class="stat-chip retard">
        <span class="stat-number">{{ getCount('EN_RETARD') }}</span>
        <span class="stat-label">En Retard</span>
      </div>
    </div>

    <!-- ============================
         FILTRES PAR STATUT
         ============================ -->
    <div class="filtres animate-fade-in-up stagger-2">
      <button class="filtre-btn" [class.actif]="filtreActif() === 'TOUS'"
              (click)="filtrerProjets('TOUS')">
        Tous
      </button>
      <button class="filtre-btn" [class.actif]="filtreActif() === 'EN_COURS'"
              (click)="filtrerProjets('EN_COURS')">
        🔵 En Cours
      </button>
      <button class="filtre-btn" [class.actif]="filtreActif() === 'TERMINÉ'"
              (click)="filtrerProjets('TERMINÉ')">
        ✅ Terminés
      </button>
      <button class="filtre-btn" [class.actif]="filtreActif() === 'EN_RETARD'"
              (click)="filtrerProjets('EN_RETARD')">
        🔴 En Retard
      </button>
    </div>

    <!-- ============================
         MESSAGE DE CHARGEMENT
         ============================ -->
    @if (chargement()) {
      <div class="chargement">
        <div class="loader"></div>
        <p>Chargement des projets...</p>
      </div>
    }

    <!-- ============================
         MESSAGE SI AUCUN PROJET
         ============================ -->
    @if (!chargement() && projetsFiltres().length === 0) {
      <div class="vide animate-scale-in">
        <div class="vide-icon">📭</div>
        <h3>Aucun projet trouvé</h3>
        <p>Commencez par créer votre premier projet universitaire</p>
        <button class="btn btn-primary" routerLink="/projets/nouveau">
          ✨ Créer un projet
        </button>
      </div>
    }

    <!-- ============================
         GRILLE DES PROJETS
         ============================ -->
    <div class="projets-grille">
      @for (projet of projetsFiltres(); track projet.id; let i = $index) {
        <div class="carte-projet" [class.retard]="projet.statut === 'EN_RETARD'"
             [style.animation-delay]="(i * 0.06) + 's'">

          <!-- Statut badge -->
          <div class="badge-statut" [ngClass]="getClassStatut(projet.statut)">
            {{ getStatutLabel(projet.statut) }}
          </div>

          <!-- Titre et matière -->
          <h3 class="carte-titre">{{ projet.titre }}</h3>
          <p class="matiere">📖 {{ projet.matiere || 'Matière non précisée' }}</p>

          @if (projet.description) {
            <p class="description">{{ projet.description }}</p>
          }

          <!-- Membres du groupe -->
          <div class="membres-row">
            <div class="membres-avatars">
              @for (membre of (projet.membres || []).slice(0, 3); track membre) {
                <span class="avatar-circle" [title]="membre">{{ membre.charAt(0).toUpperCase() }}</span>
              }
              @if ((projet.membres?.length || 0) > 3) {
                <span class="avatar-circle more">+{{ (projet.membres?.length || 0) - 3 }}</span>
              }
            </div>
            <span class="membres-count">{{ projet.membres?.length || 0 }} membre(s)</span>
          </div>

          <!-- Barre de progression (avancement) -->
          <div class="avancement-section">
            <div class="avancement-label">
              <span>Avancement</span>
              <strong class="avancement-pct">{{ projet.avancement | number:'1.0-0' }}%</strong>
            </div>
            <div class="barre-progression">
              <div class="progression-fill"
                   [style.width.%]="projet.avancement"
                   [class.terminé]="projet.avancement >= 100"
                   [class.retard]="projet.statut === 'EN_RETARD'">
              </div>
            </div>
          </div>

          <!-- Date limite -->
          @if (projet.dateLimite) {
            <div class="date-limite" [class.depassee]="projet.statut === 'EN_RETARD'">
              📅 {{ projet.dateLimite | date:'dd MMM yyyy' }}
            </div>
          }

          <!-- Actions -->
          <div class="actions">
            <button class="btn btn-ghost" (click)="voirDetails(projet.id!)">
              Voir détails →
            </button>
            <button class="btn-icon-only btn-danger-ghost" (click)="supprimerProjet(projet.id!)" title="Supprimer">
              🗑
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
      gap: 16px;
      flex-wrap: wrap;
    }
    .page-title {
      font-size: 28px;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }
    .page-subtitle {
      color: var(--text-secondary);
      font-size: 15px;
    }

    /* Stats Bar */
    .stats-bar {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .stat-chip {
      background: var(--bg-card);
      border-radius: var(--radius-md);
      padding: 14px 22px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 90px;
      box-shadow: var(--shadow-sm);
      border: 1px solid rgba(0,0,0,0.04);
      transition: all var(--transition-normal);
    }
    .stat-chip:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    .stat-number { font-size: 24px; font-weight: 800; color: var(--text-primary); }
    .stat-label { font-size: 12px; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-chip.en-cours .stat-number { color: var(--primary); }
    .stat-chip.termine .stat-number { color: var(--success); }
    .stat-chip.retard .stat-number { color: var(--danger); }

    /* Filtres */
    .filtres {
      display: flex;
      gap: 8px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }
    .filtre-btn {
      padding: 10px 20px;
      border: 2px solid transparent;
      background: var(--bg-card);
      border-radius: var(--radius-full);
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      transition: all var(--transition-normal);
      box-shadow: var(--shadow-sm);
    }
    .filtre-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
      transform: translateY(-1px);
    }
    .filtre-btn.actif {
      background: var(--gradient-primary);
      color: white;
      border-color: transparent;
      box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
    }

    /* Grille projets */
    .projets-grille {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 20px;
    }
    .carte-projet {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: var(--shadow-sm);
      border: 1px solid rgba(0,0,0,0.04);
      position: relative;
      transition: all var(--transition-normal);
      animation: fadeInUp 0.5s ease-out both;
      overflow: hidden;
    }
    .carte-projet::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--gradient-primary);
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      opacity: 0;
      transition: opacity var(--transition-normal);
    }
    .carte-projet:hover::before { opacity: 1; }
    .carte-projet:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }
    .carte-projet.retard::before {
      background: var(--gradient-accent);
      opacity: 1;
    }

    /* Badge statut */
    .badge-statut {
      position: absolute;
      top: 16px;
      right: 16px;
      padding: 5px 12px;
      border-radius: var(--radius-full);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }
    .statut-en_cours { background: #e8f4fd; color: #1976d2; }
    .statut-terminé { background: #e6f9f0; color: #0d9058; }
    .statut-en_retard { background: #fde8ed; color: #c0392b; }

    .carte-titre {
      margin: 0 0 8px;
      color: var(--text-primary);
      font-size: 18px;
      font-weight: 700;
      padding-right: 90px;
      line-height: 1.3;
    }
    .matiere { color: var(--text-muted); font-size: 13px; margin: 0 0 8px; font-weight: 500; }
    .description {
      color: var(--text-secondary);
      font-size: 14px;
      margin: 0 0 16px;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Membres */
    .membres-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }
    .membres-avatars { display: flex; }
    .avatar-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--gradient-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      margin-left: -8px;
      border: 2px solid var(--bg-card);
      transition: transform var(--transition-fast);
    }
    .avatar-circle:first-child { margin-left: 0; }
    .avatar-circle:hover { transform: scale(1.15); z-index: 1; }
    .avatar-circle.more { background: var(--bg-main); color: var(--text-secondary); font-size: 11px; }
    .membres-count { font-size: 13px; color: var(--text-muted); }

    /* Avancement */
    .avancement-section { margin: 16px 0; }
    .avancement-label {
      font-size: 13px;
      color: var(--text-secondary);
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
    }
    .avancement-pct { color: var(--primary); }
    .barre-progression {
      background: #f0f2f5;
      border-radius: var(--radius-full);
      height: 8px;
      overflow: hidden;
    }
    .progression-fill {
      height: 100%;
      background: var(--gradient-primary);
      border-radius: var(--radius-full);
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .progression-fill.terminé { background: var(--gradient-success); }
    .progression-fill.retard { background: var(--gradient-accent); }

    .date-limite {
      font-size: 13px;
      color: var(--text-muted);
      margin: 8px 0;
      font-weight: 500;
    }
    .date-limite.depassee { color: var(--danger); font-weight: 600; }

    /* Actions */
    .actions {
      display: flex;
      gap: 8px;
      margin-top: 16px;
      align-items: center;
      justify-content: space-between;
    }

    /* Buttons */
    .btn {
      padding: 10px 22px;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all var(--transition-normal);
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-primary {
      background: var(--gradient-primary);
      color: white;
      box-shadow: 0 4px 15px rgba(67, 97, 238, 0.25);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(67, 97, 238, 0.35);
    }
    .btn-glow {
      position: relative;
      overflow: hidden;
    }
    .btn-glow::after {
      content: '';
      position: absolute;
      inset: -50%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      animation: shimmer 3s infinite;
      background-size: 200% 100%;
    }
    .btn-icon { font-size: 16px; }
    .btn-ghost {
      background: transparent;
      color: var(--primary);
      padding: 8px 16px;
      border-radius: var(--radius-sm);
      font-weight: 600;
    }
    .btn-ghost:hover {
      background: rgba(67, 97, 238, 0.08);
    }
    .btn-icon-only {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all var(--transition-normal);
    }
    .btn-danger-ghost:hover { background: #fde8ed; }

    /* Chargement */
    .chargement {
      text-align: center;
      padding: 80px 20px;
      color: var(--text-muted);
      animation: fadeIn 0.5s ease;
    }
    .loader {
      width: 40px;
      height: 40px;
      border: 3px solid #f0f2f5;
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Vide */
    .vide {
      text-align: center;
      padding: 80px 20px;
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
    }
    .vide-icon { font-size: 56px; margin-bottom: 16px; }
    .vide h3 { font-size: 20px; color: var(--text-primary); margin-bottom: 8px; }
    .vide p { color: var(--text-muted); margin-bottom: 24px; }

    @media (max-width: 768px) {
      .projets-grille { grid-template-columns: 1fr; }
      .page-title { font-size: 22px; }
      .stats-bar { gap: 8px; }
      .stat-chip { padding: 10px 14px; min-width: 70px; }
      .stat-number { font-size: 20px; }
    }
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
   * Retourne le nombre de projets par statut.
   */
  getCount(statut: string): number {
    return this.projets().filter(p => p.statut === statut).length;
  }

  /**
   * Filtre la liste des projets par statut.
   *
   * @param statut 'TOUS', 'EN_COURS', 'TERMINÉ', 'EN_RETARD'
   */
  filtrerProjets(statut: string): void {
    this.filtreActif.set(statut);
    if (statut === 'TOUS') {
      this.projetsFiltres.set(this.projets());
    } else {
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
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.')) {
      this.projetService.supprimerProjet(id).subscribe({
        next: () => {
          this.chargerProjets();
        },
        error: (err) => console.error('Erreur lors de la suppression:', err)
      });
    }
  }

  /**
   * Retourne la classe CSS correspondant au statut d'un projet.
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
