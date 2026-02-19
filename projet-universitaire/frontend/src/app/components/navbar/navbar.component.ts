/**
 * ============================================================
 * COMPOSANT : NavbarComponent
 * ============================================================
 * Barre de navigation principale de l'application.
 * Présente le logo et les liens de navigation.
 * ============================================================
 */
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="navbar">
      <!-- Logo et titre -->
      <div class="navbar-brand" routerLink="/projets">
        🎓 <span>Gestion Projets Universitaires</span>
        <small>SUP'COM 2025-2026</small>
      </div>

      <!-- Liens de navigation -->
      <div class="navbar-links">
        <a routerLink="/projets" routerLinkActive="actif" [routerLinkActiveOptions]="{exact: true}">
          📚 Mes Projets
        </a>
        <a routerLink="/projets/nouveau" routerLinkActive="actif">
          ➕ Nouveau Projet
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #2c3e50, #4a6fa5);
      color: white;
      padding: 0 24px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
    }
    .navbar-brand small {
      font-size: 11px;
      font-weight: normal;
      opacity: 0.7;
      background: rgba(255,255,255,0.15);
      padding: 2px 8px;
      border-radius: 10px;
    }
    .navbar-links { display: flex; gap: 8px; }
    .navbar-links a {
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      transition: all 0.2s;
    }
    .navbar-links a:hover, .navbar-links a.actif {
      background: rgba(255,255,255,0.2);
      color: white;
    }
  `]
})
export class NavbarComponent {}
