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
      <div class="navbar-inner">
        <!-- Logo et titre -->
        <div class="navbar-brand" routerLink="/projets">
          <div class="logo-icon">
            <span>🎓</span>
          </div>
          <div class="brand-text">
            <span class="brand-title">Gestion Projets</span>
            <span class="brand-sub">SUP'COM 2025-2026</span>
          </div>
        </div>

        <!-- Liens de navigation -->
        <div class="navbar-links">
          <a routerLink="/projets" routerLinkActive="actif" [routerLinkActiveOptions]="{exact: true}"
             class="nav-link">
            <span class="nav-icon">📚</span>
            <span class="nav-text">Mes Projets</span>
          </a>
          <a routerLink="/projets/nouveau" routerLinkActive="actif"
             class="nav-link nav-link-accent">
            <span class="nav-icon">✨</span>
            <span class="nav-text">Nouveau Projet</span>
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      background-size: 200% 200%;
      animation: gradientShift 8s ease infinite;
      color: white;
      height: 72px;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
    }
    .navbar-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      transition: transform var(--transition-normal);
    }
    .navbar-brand:hover { transform: scale(1.02); }
    .logo-icon {
      width: 44px;
      height: 44px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      transition: all var(--transition-normal);
    }
    .navbar-brand:hover .logo-icon {
      background: rgba(255, 255, 255, 0.2);
      transform: rotate(-5deg);
    }
    .brand-text { display: flex; flex-direction: column; }
    .brand-title {
      font-size: 17px;
      font-weight: 700;
      letter-spacing: -0.3px;
      line-height: 1.2;
    }
    .brand-sub {
      font-size: 11px;
      font-weight: 400;
      opacity: 0.5;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .navbar-links { display: flex; gap: 8px; }
    .nav-link {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      padding: 10px 18px;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all var(--transition-normal);
      position: relative;
      overflow: hidden;
    }
    .nav-link::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-md);
      transform: scaleX(0);
      transform-origin: right;
      transition: transform var(--transition-normal);
    }
    .nav-link:hover::before { transform: scaleX(1); transform-origin: left; }
    .nav-link:hover { color: white; text-decoration: none; }
    .nav-link.actif {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .nav-link-accent {
      background: var(--gradient-primary);
      color: white !important;
      border: none;
    }
    .nav-link-accent::before { background: rgba(255, 255, 255, 0.15); }
    .nav-icon { font-size: 16px; }
    @media (max-width: 600px) {
      .brand-text { display: none; }
      .nav-text { display: none; }
      .navbar-inner { padding: 0 12px; }
    }
  `]
})
export class NavbarComponent {}
