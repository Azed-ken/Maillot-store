# Maillot Store

Boutique vitrine e-commerce spécialisée dans la vente de maillots de football authentiques (clubs européens et sélections nationales), avec commande via WhatsApp (aucun paiement en ligne) et un dashboard administrateur complet connecté à Supabase.

## 🧱 Stack utilisée

- **Next.js 14** (App Router, Server Components + Server Actions) — framework full-stack, déploiement natif sur Vercel, excellent pour le SEO et la performance.
- **Supabase** — base de données PostgreSQL, authentification admin, stockage des images, Row Level Security.
- **Tailwind CSS** — design system utilitaire, cohérent, léger.
- **Framer Motion** — animations fluides et discrètes (hero, menu mobile, toasts).
- **Zustand** — panier persistant côté client (localStorage), sans backend nécessaire pour le panier.
- **lucide-react** — icônes.

Aucune bibliothèque inutile n'a été ajoutée : pas de state manager lourd, pas de CSS-in-JS, pas de librairie de formulaire pour des formulaires simples.

## 📁 Structure du projet

```
maillot-store/
├── src/
│   ├── app/
│   │   ├── page.tsx                 → Accueil (hero, nouveautés, populaires)
│   │   ├── catalogue/               → Catalogue avec recherche/filtres/tri
│   │   ├── produit/[slug]/          → Fiche produit
│   │   ├── panier/                  → Panier + commande WhatsApp
│   │   └── admin/
│   │       ├── login/               → Connexion admin
│   │       └── (protected)/         → Dashboard, produits, catégories, commandes, paramètres
│   ├── components/                  → Composants UI réutilisables
│   ├── lib/
│   │   ├── supabase/                → Clients Supabase (browser / server / admin)
│   │   ├── actions/                 → Server Actions (produits, catégories, commandes, auth, réglages)
│   │   ├── cart-store.ts            → Panier (Zustand + persistance localStorage)
│   │   ├── whatsapp.ts              → Génération du message + lien WhatsApp
│   │   ├── settings.ts              → Lecture des réglages boutique
│   │   └── types.ts                 → Types partagés
│   └── middleware.ts                → Protection des routes /admin
├── supabase/
│   └── migrations/
│       ├── 0001_init.sql            → Tables, contraintes, index, RLS
│       ├── 0002_seed.sql            → Données de démonstration (optionnel)
│       └── 0003_storage.sql         → Buckets de stockage + policies
├── .env.example
└── README.md
```

## 🚀 Installation

```bash
cd maillot-store
npm install
```

## ⚙️ Configuration Supabase

1. Crée un projet sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, exécute dans l'ordre :
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0003_storage.sql`
   - (optionnel) `supabase/migrations/0002_seed.sql` pour des données de démo.
3. Dans **Authentication → Users**, crée un utilisateur admin (email + mot de passe). Note son **User UID**.
4. Dans **SQL Editor**, autorise cet utilisateur à administrer la boutique :
   ```sql
   insert into admins (user_id) values ('COLLE_ICI_LE_USER_UID');
   ```
5. Dans **Project Settings → API**, récupère :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (à garder secrète, jamais commitée)

## 🔑 Variables d'environnement

Copie `.env.example` vers `.env.local` puis renseigne tes valeurs :

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_DEFAULT_WHATSAPP_NUMBER=22900000000
NEXT_PUBLIC_DEFAULT_STORE_NAME=Maillot Store
```

`NEXT_PUBLIC_DEFAULT_*` ne servent que de secours si la table `store_settings` est vide — les vraies valeurs se gèrent ensuite depuis l'espace admin.

## 🖥️ Lancer le projet en local

```bash
npm run dev
```

Le site est disponible sur `http://localhost:3000`, l'admin sur `http://localhost:3000/admin/login`.

## 🏗️ Build de production

```bash
npm run build
npm run start
```

## ☁️ Déploiement sur Vercel

1. Pousse le projet sur GitHub (ou importe le dossier directement dans Vercel).
2. Sur [vercel.com](https://vercel.com), importe le repo.
3. Renseigne les 3 variables d'environnement Supabase dans **Project Settings → Environment Variables** (les mêmes que dans `.env.local`).
4. Déploie. Le build Next.js est détecté automatiquement.

## 🏪 Configurer le nom, le logo et le numéro WhatsApp

Tout se fait **sans toucher au code**, depuis `/admin/parametres` une fois connecté :

- nom de la boutique
- logo (upload direct, stocké dans Supabase Storage)
- slogan, description
- numéro WhatsApp (utilisé pour toutes les commandes du site)
- réseaux sociaux
- texte du footer / copyright

## 🛍️ Gérer les produits et catégories

- `/admin/categories` : crée les clubs et sélections nationales (nom, type, drapeau).
- `/admin/produits` : ajoute un maillot (nom, prix, stock, tailles, photos, domicile/extérieur/third), marque-le "Nouveau" ou "Populaire".

## 📦 Commandes

- `/admin/commandes` : liste toutes les commandes enregistrées automatiquement lors du clic sur "Commander sur WhatsApp", avec le détail des articles et la possibilité de changer le statut (Nouvelle / Confirmée / Livrée / Annulée).

## 🔐 Sécurité

- Les routes `/admin/*` sont protégées par middleware (redirection vers `/admin/login` si non connecté) **et** par une vérification serveur du statut administrateur (table `admins`, jamais lisible publiquement sauf pour vérifier sa propre ligne).
- Row Level Security activée sur toutes les tables : les visiteurs peuvent uniquement lire les produits actifs, les catégories et les réglages publics, et créer une commande — jamais lire ou modifier les commandes, produits ou réglages.
- Aucun secret n'est présent dans le code ou le ZIP : `SUPABASE_SERVICE_ROLE_KEY` reste une variable d'environnement serveur, jamais exposée au navigateur.

## 🧪 Parcours testé

- Client : navigation, recherche, filtres, fiche produit, sélection taille/quantité, ajout/suppression panier, calcul du total, blocage si stock insuffisant, persistance du panier après rafraîchissement, génération du message WhatsApp, enregistrement de la commande dans Supabase.
- Admin : connexion, ajout/modification/suppression de produits et catégories, upload de photos, changement de statut de commande, statistiques calculées à partir des vraies commandes, modification du nom/logo/WhatsApp.
- Sécurité : un utilisateur non listé dans `admins` ne peut ni voir ni modifier les données admin, même connecté.

## 📝 Notes

- Le panier n'exige aucun compte client : il vit en `localStorage` via Zustand.
- Aucune information (nom, téléphone, adresse) n'est demandée avant l'ouverture de WhatsApp — le message est généré automatiquement à partir du panier réel.
- La taille est facultative : si un produit n'a aucune taille définie, le sélecteur de taille ne s'affiche pas.
