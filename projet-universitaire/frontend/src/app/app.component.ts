/**
 * ============================================================
 * COMPOSANT RACINE : AppComponent
 * ============================================================
 * Point d'entrée de l'application Angular.
 * Contient la navbar et le routeur qui charge les composants pages.
 * ============================================================
 */
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  template: `
    <!-- Barre de navigation (affichée sur toutes les pages) -->
    <app-navbar></app-navbar>

    <!-- Zone principale : le router-outlet affiche le composant actif selon l'URL -->
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--bg-main);
    }
    .main-content {
      padding: 32px 24px;
      max-width: 1400px;
      margin: 0 auto;
      min-height: calc(100vh - 72px);
      animation: fadeIn 0.3s ease-out;
    }
    @media (max-width: 768px) {
      .main-content { padding: 16px 12px; }
    }
  `]
})
export class AppComponent {
  title = 'Plateforme Gestion Projets Universitaires - SUP\'COM';
}
