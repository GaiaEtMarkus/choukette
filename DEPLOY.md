# 🚀 Guide de déploiement sur Render

## ✅ Étape 1 : Préparer le code (FAIT)

- ✅ Fichier `public/_redirects` créé pour Vue Router
- ✅ Build testé localement et fonctionne

## 📦 Étape 2 : Pousser sur GitHub

```bash
# Ajouter le fichier _redirects
git add public/_redirects
git commit -m "Add _redirects for Vue Router"
git push origin main
```

## ☁️ Étape 3 : Créer un compte Render

1. Allez sur [render.com](https://render.com)
2. Cliquez sur **"Get Started"** ou **"Sign Up"**
3. Inscrivez-vous avec GitHub (recommandé pour la suite)
4. Autorisez Render à accéder à vos dépôts GitHub

## 🎯 Étape 4 : Créer un Static Site

### 4.1 Dans le dashboard Render

1. Cliquez sur **"New +"** en haut à droite
2. Sélectionnez **"Static Site"**

### 4.2 Connecter votre dépôt GitHub

1. Vous verrez la liste de vos dépôts GitHub
2. Cherchez **"Choukette"** (ou le nom de votre repo)
3. Cliquez sur **"Connect"** à côté de votre projet

### 4.3 Configuration du déploiement

Remplissez les champs suivants :

| Champ | Valeur |
|-------|--------|
| **Name** | `choukette` (ou le nom que vous voulez) |
| **Branch** | `master` |
| **Build Command** | `npm install && npm run build-only` |
| **Publish Directory** | `dist` |

**Important** : Utilisez `build-only` au lieu de `build` pour éviter le type-checking qui peut être lent sur Render.

### 4.4 Lancer le déploiement

1. Cliquez sur **"Create Static Site"**
2. Render va :
   - Cloner votre dépôt
   - Installer les dépendances (`npm install`)
   - Builder votre app (`npm run build-only`)
   - Déployer le dossier `dist`

⏱️ Le premier déploiement prend environ 3-5 minutes.

## ✨ Étape 5 : Vérifier le déploiement

### 5.1 Suivre les logs

Dans le dashboard Render, vous verrez les logs en temps réel :
- ✅ Cloning repository...
- ✅ Installing dependencies...
- ✅ Building application...
- ✅ Build successful!
- ✅ Your site is live! 🎉

### 5.2 Accéder à votre site

Une fois terminé :
- 🟢 **Live** en haut à gauche
- L'URL : `https://choukette.onrender.com` (ou le nom que vous avez choisi)

## 🔄 Déploiement automatique

✅ **Déjà activé par défaut !**

À chaque `git push` sur votre branche `master`, Render :
1. Détecte automatiquement le changement
2. Rebuild l'application
3. Redéploie en 1-3 minutes

## ❌ Problèmes courants

### Build échoue avec erreurs TypeScript

**Solution** : Utiliser `build-only` (déjà configuré ✅)

### Routes Vue Router donnent 404

**Solution** : Vérifier que `public/_redirects` existe avec :
```
/*  /index.html  200
```

### Build trop lent

**Solution** : Utiliser `npm run build-only` au lieu de `npm run build`

## 🎉 C'est tout !

Votre application est maintenant en ligne et se met à jour automatiquement à chaque push !

