# 🚀 Guide de Déploiement - Plateforme Gestion Projets Universitaires

Ce guide vous accompagne pour déployer votre application sur le cloud.

---

## 📋 Architecture de Déploiement

- **Frontend** : Cloudflare Pages (gratuit)
- **Backend** : Railway.app (gratuit avec limitations)
- **Database** : MongoDB Atlas (gratuit jusqu'à 512 MB)

---

## 1️⃣ MongoDB Atlas - Créer la Base de Données

### Étapes :

1. **Créer un compte MongoDB Atlas**
   - Aller sur : https://www.mongodb.com/cloud/atlas/register
   - Créer un compte gratuit

2. **Créer un Cluster**
   - Choisir l'option **FREE** (M0 Sandbox)
   - Région : Choisir la plus proche (ex: Frankfurt, Europe)
   - Nom du cluster : `ProjetUniversitaire`

3. **Créer un utilisateur de base de données**
   - Database Access → Add New Database User
   - Username : `admin_projet`
   - Password : Générer un mot de passe fort (noter le quelque part !)
   - Built-in Role : `Atlas Admin`

4. **Configurer Network Access**
   - Network Access → Add IP Address
   - Cliquer sur `Allow Access from Anywhere` (0.0.0.0/0)
   - Ceci est nécessaire pour Railway

5. **Obtenir la Connection String**
   - Clusters → Connect → Connect your application
   - Driver : Java, Version : 4.3 or later
   - Copier la connection string et **remplacer** `<password>` + **ajouter** le nom de la base :
   ```
   mongodb+srv://admin_projet:VOTRE_MOT_DE_PASSE@projetuniversitaire.xxxxx.mongodb.net/projet_universitaire_db?retryWrites=true&w=majority
   ```

✅ **Gardez cette URI précieusement !**

---

## 2️⃣ Railway.app - Déployer le Backend Spring Boot

### Étapes :

1. **Créer un compte Railway**
   - Aller sur : https://railway.app
   - Se connecter avec GitHub

2. **Créer un nouveau projet**
   - New Project → Deploy from GitHub repo
   - Sélectionner votre repo `projet_uni`

3. **Configurer le Root Directory**
   - Dans les paramètres du service → **Root Directory** : `projet-universitaire/backend`

4. **Ajouter les variables d'environnement**
   - Dans le dashboard Railway → **Variables** → ajouter :

   | Variable | Valeur |
   |---|---|
   | `MONGODB_URI` | `mongodb+srv://admin_projet:MOT_DE_PASSE@cluster.mongodb.net/projet_universitaire_db?retryWrites=true&w=majority` |
   | `ALLOWED_ORIGINS` | `https://votre-projet.pages.dev,http://localhost:4200` |
   | `LOG_LEVEL` | `INFO` |

   > ⚠️ Mettre à jour `ALLOWED_ORIGINS` après avoir obtenu l'URL Cloudflare Pages

5. **Générer le domaine public**
   - Settings → Generate Domain
   - Votre backend sera sur : `https://votre-projet.up.railway.app`

6. **Tester l'API**
   ```
   GET https://votre-projet.up.railway.app/api/projets
   ```

✅ **Notez l'URL de votre backend Railway !**

---

## 3️⃣ Cloudflare Pages - Déployer le Frontend Angular

### Mettre à jour l'URL du backend avant de déployer :

1. **Ouvrir** : `frontend/src/environments/environment.prod.ts`
2. **Remplacer** l'URL par celle de Railway :
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://votre-projet.up.railway.app/api/projets'
   };
   ```
3. **Commit et push :**
   ```bash
   git add .
   git commit -m "Update production API URL"
   git push
   ```

### Déploiement sur Cloudflare Pages :

1. **Créer un compte Cloudflare**
   - Aller sur : https://dash.cloudflare.com/sign-up

2. **Accéder à Pages**
   - Dashboard → Workers & Pages → Create application → Pages → Connect to Git

3. **Sélectionner votre repository** `projet_uni`

4. **Configurer le build** :

   | Paramètre | Valeur |
   |---|---|
   | **Project name** | `projet-universitaire` |
   | **Production branch** | `main` |
   | **Root directory** | `projet-universitaire/frontend` |
   | **Build command** | `npm run build` |
   | **Build output directory** | `dist/projet-universitaire-frontend/browser` |

5. **Déployer** → Le build prend 5-10 minutes
   - Votre frontend sera sur : `https://projet-universitaire.pages.dev`

✅ **Votre frontend est en ligne !**

---

## 4️⃣ Finaliser la Configuration CORS

1. **Retourner sur Railway** → Variables
2. Mettre à jour `ALLOWED_ORIGINS` :
   ```
   https://projet-universitaire.pages.dev,http://localhost:4200
   ```
3. Railway redémarre automatiquement le backend

---

## 🎉 Vérification Finale

1. Ouvrir `https://projet-universitaire.pages.dev`
2. Créer un nouveau projet
3. Vérifier dans MongoDB Atlas → Browse Collections → `projets`

---

## 🔧 Commandes Utiles

```bash
# Build local du frontend pour production
cd frontend
npm run build -- --configuration production

# Lancer le backend avec MongoDB Atlas en local
# Créer un .env dans backend/ avec MONGODB_URI=...
cd backend
mvn spring-boot:run
```

---

## 📊 Limites des Plans Gratuits

| Service | Limite |
|---|---|
| MongoDB Atlas M0 | 512 MB, shared cluster |
| Railway Hobby | 500h/mois, $5 crédits offerts |
| Cloudflare Pages | Illimité pour sites statiques |

---

## 🆘 Résolution de Problèmes

**Erreur CORS** → Vérifier que `ALLOWED_ORIGINS` contient la bonne URL Cloudflare Pages

**Backend ne démarre pas** → Vérifier `MONGODB_URI` dans Railway Variables → View Logs

**Frontend affiche erreur de chargement** → Ouvrir F12 → Console → Vérifier l'URL de l'API dans `environment.prod.ts`

**Cloudflare build échoue** → Vérifier Root directory = `projet-universitaire/frontend`

---

## 🚀 Déploiements Automatiques

Une fois configuré :
- **Push sur GitHub** → **Cloudflare Pages** redéploie automatiquement le frontend
- **Push sur main** → **Railway** redéploie automatiquement le backend

Votre pipeline CI/CD est en place ! 🎉
