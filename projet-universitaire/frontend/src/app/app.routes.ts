/**
 * ============================================================
 * CONFIGURATION DES ROUTES : app.routes.ts
 * ============================================================
 * Définit le mapping entre les URLs et les composants Angular.
 *
 * Routes disponibles :
 *   /              → redirige vers /projets
 *   /projets       → liste des projets
 *   /projets/nouveau → formulaire de création
 *   /projets/:id   → détails d'un projet spécifique
 * ============================================================
 */
import { Routes } from '@angular/router';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectCreateComponent } from './components/project-create/project-create.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';

export const routes: Routes = [
  // Route par défaut : redirige vers la liste des projets
  { path: '', redirectTo: '/projets', pathMatch: 'full' },

  // Liste de tous les projets
  { path: 'projets', component: ProjectListComponent },

  // Formulaire de création d'un nouveau projet
  // Note : 'nouveau' doit être AVANT ':id' pour éviter les conflits de routing
  { path: 'projets/nouveau', component: ProjectCreateComponent },

  // Détails d'un projet spécifique (avec son ID dans l'URL)
  { path: 'projets/:id', component: ProjectDetailsComponent },

  // Toute URL inconnue : redirige vers la liste
  { path: '**', redirectTo: '/projets' }
];
