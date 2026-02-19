/**
 * ============================================================
 * CONFIGURATION DE L'APPLICATION ANGULAR : app.config.ts
 * ============================================================
 * Déclare les providers globaux de l'application Angular 18.
 * Dans Angular 18 Standalone, on n'utilise plus AppModule.
 * Tous les providers sont déclarés ici.
 * ============================================================
 */
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Fournit le routeur Angular avec les routes définies dans app.routes.ts
    provideRouter(routes),

    // Fournit le HttpClient pour les requêtes HTTP vers l'API REST Spring Boot
    // INDISPENSABLE pour que les services puissent injecter HttpClient
    provideHttpClient()
  ]
};
