# PointPro - Solution SaaS de Gestion de Présence

<p align="center">
  <img src="public/Pointpro.png" alt="PointPro Logo" width="200" />
</p>

## À Propos de PointPro

**PointPro** est une solution SaaS (Software as a Service) de gestion de présence et de pointage du personnel. Conçue principalement pour les entreprises d'Afrique de l'Ouest (BTP, logistique, commerce, sécurité, etc.), elle permet aux employés de pointer leur arrivée et départ depuis leur téléphone avec une vérification par géolocalisation.

### Fonctionnalités Principales

- **Architecture Multi-tenant** : Chaque entreprise dispose de son propre espace isolé, configurant ses horaires, tolérances de retard, etc.
- **Pointage & Géofencing** : Pointage mobile avec vérification stricte de la position GPS de l'employé par rapport aux zones géographiques autorisées (calcul par formule de Haversine).
- **Calcul Automatique** : Calcul automatique des heures travaillées, des retards et des absences non justifiées.
- **Tableau de Bord** : Interface d'administration offrant une vue synthétique et en temps réel de la présence par département.
- **Rapports et Exports** : Génération de rapports automatiques (journaliers, hebdomadaires, mensuels) exportables en PDF ou Excel.

## Stack Technologique

Le projet repose sur une architecture moderne couplant Laravel et React via Inertia.js (Serveur-Side Routing avec composants Frontend réactifs), communément appelé la "VILT Stack".

* **Backend** : Laravel 11/12 (PHP 8.2+)
* **Frontend** : React 18 avec TypeScript
* **State & Routing** : Inertia.js
* **Stylisation** : Tailwind CSS v3 (avec `@tailwindcss/forms` et `@headlessui/react`)
* **Base de données** : MySQL (MariaDB)
* **Cartographie** : Leaflet & React-Leaflet
* **Bundle et Build** : Vite

## Prérequis

- PHP >= 8.2
- Composer
- Node.js & npm (ou yarn / bun)
- MySQL / MariaDB

## Installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo> PointPro
   cd PointPro
   ```

2. **Installer les dépendances PHP et Node.js**
   ```bash
   composer install
   npm install
   ```

3. **Configuration de l'environnement**
   Copiez le fichier d'exemple et générez la clé d'application :
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   Renseignez ensuite vos informations de base de données dans le fichier `.env` :
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=pointpro
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. **Migrations et Seeders**
   Créez la structure de la base de données et peuplez-la avec les données de test :
   ```bash
   php artisan migrate --seed
   ```

5. **Lancer les serveurs de développement**
   Il vous faut lancer le serveur PHP et le bundler Vite simultanément (dans deux terminaux distincts) :
   ```bash
   php artisan serve
   ```
   ```bash
   npm run dev
   ```

## Comptes de Test

La base de données contient différents rôles préconfigurés pour faciliter les tests de la plateforme. 

### Comptes Administrateur & Super-Admin

| Entreprise | Email | Mot de passe | Plan |
|---|---|---|---|
| SARL Tech Abidjan | `admin@techabidjan.ci` | `password` | Business |
| BTP Construire CI | `admin@btpconstruire.ci` | `password` | Enterprise |
| Micro Finance Ouest | `admin@mfo.ci` | `password` | Starter |
| Super Admin (PointPro) | `super@pointpro.app` | `password` | — |

### Compte Employé (Exemple)

- **Email** : `melvinphyllisakou+2@gmail.com`
- **Mot de passe** : `PPEMP-010`
- **Matricule** : `PPEMP-010` (Peut aussi être utilisé pour se connecter au lieu de l'email)

**Connexion Web** : L'accès pointage et admin se fait depuis `http://localhost:8000/login` ou l'URL configurée dans `APP_URL`.

## Sécurité

- Authentification gérée par Laravel (cookies sécurisés HttpOnly).
- Protection CSRF native (mise en cache automatique du token XSRF via Inertia).
- Délimitation (isolation) stricte des données entre locataires ("tenants") utilisant les **Global Scopes** d'Eloquent.

## Développeurs

Pour toute contribution, veuillez respecter les conventions de codage standard (PSR-12 pour PHP, ESLint/Prettier pour JS/TS) et le typage TypeScript. Des tests de régression doivent être exécutés avant tout déploiement.
