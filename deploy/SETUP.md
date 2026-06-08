# Déploiement de facture.royalcargo225.com sur le VPS

Ce dossier contient la configuration de déploiement. Le workflow GitHub Actions
(`.github/workflows/deploy.yml`) build l'app sur le runner GitHub (sortie
`output: "standalone"` de Next.js, donc pas besoin de builder sur le VPS), puis
envoie le résultat par `rsync` via SSH et redémarre l'app avec PM2.

Structure cible sur le VPS :

```
/home/dev-issouf/apps/facturer/
├── releases/
│   ├── release-20260608120000-abcdef12/   <- une release par déploiement
│   └── release-20260608123000-9988aabb/
├── shared/
│   └── .env                                <- DATABASE_URL, persiste entre les déploiements
├── current -> releases/release-...         <- symlink vers la release active
└── logs/
```

## 1. Préparer le VPS (à faire une seule fois)

En tant que `dev-issouf` (le dossier est dans son `$HOME`, pas besoin de `sudo`) :

```bash
mkdir -p /home/dev-issouf/apps/facturer/{releases,shared,logs}

# Fichier d'environnement persistant (jamais écrasé par un déploiement)
nano /home/dev-issouf/apps/facturer/shared/.env
# -> contenu : DATABASE_URL="mysql://user:password@127.0.0.1:3306/facture_db"
chmod 600 /home/dev-issouf/apps/facturer/shared/.env
```

Outils nécessaires sur le VPS :

```bash
# Node.js 24 (via nvm ou nodesource) — doit correspondre à la version utilisée en CI
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 (gestion de process)
sudo npm install -g pm2
pm2 startup            # suit les instructions affichées pour activer le démarrage au boot
```

## 2. Créer une clé SSH dédiée au déploiement

Sur ta machine locale (PAS sur le VPS) :

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ./deploy_key -N ""
```

Copie la clé **publique** sur le VPS :

```bash
ssh-copy-id -i ./deploy_key.pub dev-issouf@<IP_DU_VPS>
# ou manuellement : ajoute le contenu de deploy_key.pub dans
# /home/dev-issouf/.ssh/authorized_keys sur le VPS
```

Vérifie que la connexion fonctionne : `ssh -i ./deploy_key dev-issouf@<IP_DU_VPS>`

Garde `deploy_key` (la clé privée) — elle ira dans les secrets GitHub ci-dessous.
**Ne la commit jamais dans le repo.**

## 3. Configurer les secrets GitHub

Dans le repo GitHub → Settings → Secrets and variables → Actions → New repository secret :

| Secret | Valeur |
|---|---|
| `VPS_HOST` | IP ou nom de domaine du VPS |
| `VPS_USER` | utilisateur SSH de déploiement (ex: `dev-issouf`) |
| `VPS_SSH_KEY` | contenu complet de `deploy_key` (clé privée) |
| `VPS_PORT` | port SSH du VPS (requis — pas de valeur par défaut dans le workflow) |

Le workflow se déclenche sur chaque push vers la branche `dev-issouf` (modifiable
dans `.github/workflows/deploy.yml`), ou manuellement via l'onglet Actions
("Run workflow").

## 4. Installer nginx et obtenir le certificat SSL

```bash
sudo apt-get update
sudo apt-get install -y nginx certbot python3-certbot-nginx

# Copier la config (adapter le chemin si le repo n'est pas cloné sur le VPS) :
sudo cp deploy/nginx-facture.royalcargo225.com.conf \
   /etc/nginx/sites-available/facture.royalcargo225.com
sudo ln -s /etc/nginx/sites-available/facture.royalcargo225.com /etc/nginx/sites-enabled/
sudo mkdir -p /var/www/certbot
sudo nginx -t && sudo systemctl reload nginx
```

⚠️ Avant de continuer : crée un enregistrement DNS de type **A** (et **AAAA** si IPv6)
pour `facture.royalcargo225.com` pointant vers l'IP du VPS, et attends sa propagation
(`dig facture.royalcargo225.com` doit renvoyer l'IP du VPS).

Génère le certificat (certbot modifie automatiquement le fichier nginx pour
ajouter le bloc HTTPS et la redirection HTTP → HTTPS) :

```bash
sudo certbot --nginx -d facture.royalcargo225.com
```

Le renouvellement automatique est configuré par défaut via un timer systemd
(`sudo systemctl status certbot.timer`).

## 5. Premier déploiement

Pousse sur `dev-issouf` (ou lance le workflow manuellement). Si tout se passe bien :

```bash
pm2 status            # le process "facturer" doit être "online"
curl -I http://127.0.0.1:3999   # doit répondre 200
curl -I https://facture.royalcargo225.com
```

## Rollback rapide

Chaque déploiement garde les 5 dernières releases dans `releases/`. Pour revenir
en arrière :

```bash
ln -sfn /home/dev-issouf/apps/facturer/releases/<ancienne-release> /home/dev-issouf/apps/facturer/current
pm2 restart facturer
```
