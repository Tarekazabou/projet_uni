/**
 * ============================================================
 * POINT D'ENTRÉE : main.ts
 * ============================================================
 * Fichier principal qui bootstrap (démarre) l'application Angular.
 * Utilise la nouvelle syntaxe Angular 18 Standalone.
 * ============================================================
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Démarrage de l'application Angular avec le composant racine et la configuration
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Erreur de démarrage Angular:', err));
