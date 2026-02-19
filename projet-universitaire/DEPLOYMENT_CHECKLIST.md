# ✅ Checklist de Déploiement

## 🗄️ MongoDB Atlas

- [ ] Compte créé sur https://mongodb.com/cloud/atlas
- [ ] Cluster gratuit M0 créé (région Europe)
- [ ] Utilisateur DB créé (noter le username + password)
- [ ] Network Access → Allow from Anywhere (0.0.0.0/0)
- [ ] Connection String copiée et complétée avec `/projet_universitaire_db`

**URI MongoDB** : `mongodb+srv://...`
```
_________________________________________________
```

---

## 🚂 Railway.app (Backend)

- [ ] Compte créé sur https://railway.app (via GitHub)
- [ ] Projet créé depuis GitHub repo `projet_uni`
- [ ] Root Directory configuré : `projet-universitaire/backend`
- [ ] Variables d'environnement ajoutées :
  - [ ] `MONGODB_URI` = URI MongoDB Atlas
  - [ ] `ALLOWED_ORIGINS` = `http://localhost:4200` (temporaire)
  - [ ] `LOG_LEVEL` = `INFO`
- [ ] Domain généré dans Settings
- [ ] Backend déployé ✅
- [ ] Test API réussi : `GET https://xxx.railway.app/api/projets`

**URL Backend** :
```
https://_________________________________.up.railway.app
```

---

## ☁️ Cloudflare Pages (Frontend)

- [ ] `environment.prod.ts` mis à jour avec l'URL Railway
- [ ] `git commit + push` des changements
- [ ] Compte créé sur https://dash.cloudflare.com
- [ ] Projet Pages créé et lié au repo GitHub
- [ ] Build settings configurés :
  - Root directory : `projet-universitaire/frontend`
  - Build command : `npm run build`
  - Output directory : `dist/projet-universitaire-frontend/browser`
- [ ] Build réussi ✅
- [ ] Site accessible

**URL Cloudflare Pages** :
```
https://_________________________________.pages.dev
```

---

## 🔄 CORS - Configuration Finale

- [ ] `ALLOWED_ORIGINS` mis à jour sur Railway avec l'URL Cloudflare Pages
- [ ] Backend Railway redémarré
- [ ] Test : créer un projet depuis le site Cloudflare
- [ ] Vérification MongoDB Atlas : Collections → projets → données visibles

---

## 🎉 Application Déployée !

- [ ] Frontend accessible publiquement
- [ ] Backend répond aux requêtes
- [ ] Données sauvegardées dans MongoDB Atlas
- [ ] CI/CD actif (push = auto-deploy)

**Date de déploiement** : ___________________
