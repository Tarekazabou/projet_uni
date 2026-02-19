# 🎓 Plateforme Intelligente de Gestion de Projets Universitaires
> **SUP'COM 2025-2026** | Encadré par : CHOUKAIR Zied

---

## 👥 Équipe du projet
| Nom | Prénom |
|-----|--------|
| AMAYED | Youssef |
| AOUINI | Anas |
| AZABOU | Tarek |
| CHABCHOUB | Ayoub |
| CHOUARI | Zaineb |
| DERBAL | Adam |
| JAMLI | Hayder |

---

## 📐 Architecture de l'application

```
ANGULAR (Frontend)          SPRING BOOT (Backend)        MONGODB (Base de données)
    Port 4200          ←→       Port 8080             ←→    Port 27017
                         API REST JSON
```

### Stack Technique
| Couche | Technologie | Version |
|--------|-------------|---------|
| Frontend | Angular (Standalone) | 18.x |
| Backend | Spring Boot | 3.2.x |
| Base de données | MongoDB | 7.x |
| Langage backend | Java | 17+ |
| Langage frontend | TypeScript | 5.4 |

---

## 🗂️ Structure du projet

```
projet-universitaire/
├── backend/                          ← Projet Spring Boot (Maven)
│   ├── pom.xml                       ← Dépendances Maven
│   └── src/main/java/com/supcom/projetuniversitaire/
│       ├── ProjetUniversitaireApplication.java  ← Point d'entrée
│       ├── model/
│       │   ├── Projet.java           ← Entité MongoDB "projets"
│       │   └── Tache.java            ← Sous-document embarqué
│       ├── repository/
│       │   └── ProjetRepository.java ← Accès MongoDB (Spring Data)
│       ├── service/
│       │   └── ProjetService.java    ← Logique métier
│       ├── controller/
│       │   └── ProjetController.java ← API REST (endpoints)
│       └── exception/
│           ├── ResourceNotFoundException.java
│           └── GlobalExceptionHandler.java
│
└── frontend/                         ← Projet Angular 18
    └── src/app/
        ├── models/
        │   ├── projet.model.ts       ← Interface TypeScript Projet
        │   └── tache.model.ts        ← Interface TypeScript Tache
        ├── services/
        │   └── projet.service.ts     ← Appels HTTP vers l'API
        └── components/
            ├── navbar/               ← Barre de navigation
            ├── project-list/         ← Liste des projets + filtres
            ├── project-create/       ← Formulaire création projet
            ├── project-details/      ← Détails + membres
            └── task-board/           ← Tableau Kanban (TO DO / DOING / DONE)
```

---

## 🔌 API REST - Endpoints disponibles

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/api/projets` | Liste tous les projets |
| `GET` | `/api/projets/{id}` | Récupère un projet |
| `POST` | `/api/projets` | Crée un nouveau projet |
| `PUT` | `/api/projets/{id}` | Met à jour un projet |
| `DELETE` | `/api/projets/{id}` | Supprime un projet |
| `POST` | `/api/projets/{id}/taches` | Ajoute une tâche |
| `PUT` | `/api/projets/{id}/taches/{tacheId}/statut` | Change le statut d'une tâche |
| `DELETE` | `/api/projets/{id}/taches/{tacheId}` | Supprime une tâche |
| `POST` | `/api/projets/{id}/membres` | Ajoute un membre |
| `GET` | `/api/projets/statut/{statut}` | Filtre par statut |

---

## 🚀 Démarrage du projet

### Prérequis
- **JDK 17+** : [https://adoptium.net](https://adoptium.net)
- **Node.js v20+** : [https://nodejs.org](https://nodejs.org)
- **MongoDB** (local ou Atlas) : [https://www.mongodb.com](https://www.mongodb.com)
- **Maven 3.8+** : inclus dans Spring Boot via le wrapper `mvnw`

---

### 1️⃣ Démarrer MongoDB
```bash
# Option locale
mongod --dbpath /data/db

# MongoDB démarre automatiquement sur le port 27017
# La base "projet_universitaire_db" est créée automatiquement
```

### 2️⃣ Démarrer le Backend Spring Boot
```bash
cd backend

# Compiler et lancer le serveur
./mvnw spring-boot:run
# Ou sur Windows :
mvnw.cmd spring-boot:run

# ✅ Le serveur démarre sur http://localhost:8080
```

### 3️⃣ Démarrer le Frontend Angular
```bash
cd frontend

# Installer les dépendances npm
npm install

# Lancer le serveur de développement Angular
ng serve

# ✅ L'application est disponible sur http://localhost:4200
```

---

## ✨ Fonctionnalités implémentées

### Gestion des Projets
- ✅ Créer un projet avec titre, matière, description, date limite
- ✅ Lister tous les projets avec leur avancement visuel
- ✅ Voir les détails complets d'un projet
- ✅ Supprimer un projet
- ✅ Filtrer par statut : EN_COURS / TERMINÉ / EN_RETARD

### Gestion des Membres
- ✅ Ajouter des membres au groupe depuis la liste ou la vue détails
- ✅ Affichage du nombre de membres par projet

### Tableau Kanban des Tâches
- ✅ 3 colonnes : **TO DO** | **DOING** | **DONE**
- ✅ Ajouter une tâche avec titre, description, assignation, priorité, date limite
- ✅ Déplacer une tâche entre les colonnes (← →)
- ✅ Supprimer une tâche
- ✅ **Calcul automatique de l'avancement (%)** basé sur les tâches DONE
- ✅ **Indicateur de retard** automatique (badge rouge si date dépassée)
- ✅ Priorités colorées : 🟢 FAIBLE | 🟡 MOYENNE | 🔴 ÉLEVÉE

---

## 💡 Valeur ajoutée (Innovation)

Par rapport aux outils existants (Trello, Asana, Notion) :

1. **Calcul automatique de l'avancement** : Le % est recalculé à chaque changement de statut de tâche
2. **Indicateur de retard automatique** : Détection sans intervention manuelle
3. **Adapté au contexte universitaire** : Champs matière, groupe, dates académiques
4. **Simplicité** : Interface épurée pensée pour les étudiants, pas pour des professionnels

---

## 📦 Exemple de document MongoDB (Projet)

```json
{
  "_id": "ObjectId(...)",
  "titre": "Plateforme Gestion Projets",
  "description": "Application web collaborative",
  "matiere": "Ingénierie des services numériques",
  "dateCreation": "2025-09-15",
  "dateLimite": "2026-01-31",
  "membres": ["AMAYED Youssef", "AOUINI Anas", "AZABOU Tarek"],
  "taches": [
    {
      "id": "uuid-...",
      "titre": "Conception de la base de données",
      "statut": "DONE",
      "priorite": "ÉLEVÉE",
      "assigneA": "AZABOU Tarek",
      "dateLimite": "2025-10-15",
      "enRetard": false
    }
  ],
  "avancement": 33.3,
  "statut": "EN_COURS"
}
```
