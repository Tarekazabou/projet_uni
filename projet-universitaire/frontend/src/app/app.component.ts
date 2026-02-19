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
    .main-content {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
      min-height: calc(100vh - 60px);
      background: #f4f6f8;
    }
  `]
})
export class AppComponent {
  title = 'Plateforme Gestion Projets Universitaires - SUP\'COM';
}
