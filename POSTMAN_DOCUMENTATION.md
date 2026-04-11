# 📚 Documentation Postman - AgroMarket API

## 📦 Installation

### Importer la collection dans Postman

1. Ouvrez **Postman**
2. Cliquez sur **Import** (en haut à gauche)
3. Sélectionnez le fichier: `AgroMarket_API_Espace_Client.postman_collection.json`
4. Cliquez sur **Import**

**Ou directement:** Copiez le JSON et collez-le dans Postman > Import > Paste raw text

---

## 🔧 Configuration des Variables d'Environnement

### Dans Postman

1. En bas à gauche, cliquez sur **Environments**
2. Créez un nouvel environnement: **AgroMarket-Dev**
3. Ajoutez ces variables:

```
VARIABLE          VALEUR INITIALE
─────────────────────────────────
base_url          http://localhost:5000/api/v1
access_token      (vide - remplira automatiquement après login)
user_id           (vide - remplira automatiquement)
product_id        (vide - remplira automatiquement)
order_id          (vide - remplira automatiquement)
```

4. Sélectionnez cet environnement (dropdown en haut à droite)

### Backend (.env)

Antes de démarrer, créez `.env` dans `/backend`:

```env
# Base de données
MONGO_URI=mongodb://localhost:27017/agromarket
# ou MongoDB Atlas:
# MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/agromarket

# JWT
JWT_SECRET=votre_secret_jwt_super_securise_au_moins_32_caracteres

# Serveur
PORT=5000
NODE_ENV=development
```

---

## 🚀 Workflow de Test Complet

### **Option 1: Flux Automatique (Recommandé)**

Allez dans l'onglet **🧪 Flux complet** et exécutez les 8 requêtes dans l'ordre:

1. ✅ **S'inscrire** → Crée compte + Token
2. ✅ **Récupérer produits** → Liste avec ID
3. ✅ **Voir traçabilité** → Info du produit
4. ✅ **Ajouter au panier** → Panier créé
5. ✅ **Voir le panier** → Vérify contenu
6. ✅ **Passer commande** → Commande créée
7. ✅ **Voir commandes** → Historique
8. ✅ **Dashboard** → Stats client

**Pour exécuter toutes les requêtes à la suite:**
- Sélectionnez le dossier **🧪 Flux complet**
- Cliquez sur **Run** (icône play à droite)
- Paramètre: **iterations = 1**, **delay = 500ms**

---

### **Option 2: Manuel (Détaillé)**

#### 1️⃣ **Authentification**

**POST** `/auth/register`
```json
{
  "full_name": "Kouassi Ama",
  "email": "ama@example.com",
  "phone": "+229 90000000",
  "password": "password123",
  "role": "client",
  "commune": "Cotonou"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "6677abc123",
      "full_name": "Kouassi Ama",
      "email": "ama@example.com",
      "role": "client"
    },
    "access_token": "eyJhbGc..."
  }
}
```

✅ Le **access_token** est automatiquement sauvegardé dans `{{access_token}}`

---

**POST** `/auth/login` (si déjà inscrit)
```json
{
  "email": "ama@example.com",
  "password": "password123"
}
```

---

#### 2️⃣ **Catalogue (Produits)**

**GET** `/products` (public, NOT protected)
```
?page=1&limit=10&commune=Cotonou&category=cereales&sort=price&order=asc
```

Query params expliqués:
| Param | Valeur | Requis |
|-------|--------|--------|
| `page` | 1-∞ | ❌ (défaut: 1) |
| `limit` | 1-100 | ❌ (défaut: 20) |
| `commune` | Cotonou, Duekoué... | ❌ |
| `category` | cereales, tubercules, legumes, oleagineux, autre | ❌ |
| `search` | texte libre (gari, attiéké) | ❌ |
| `sort` | price, created_at | ❌ (défaut: created_at) |
| `order` | asc, desc | ❌ (défaut: desc) |

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6677xyz789",
      "name": "Gari",
      "category": "cereales",
      "price": 5000,
      "stock_qty": 50,
      "commune": "Cotonou",
      "producer_id": {
        "_id": "6600abc123",
        "full_name": "Coopérative SCOOP"
      },
      "is_available": true
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

✅ Le premier **product._id** est sauvegardé dans `{{product_id}}`

---

**GET** `/products/{{product_id}}` (détail + traçabilité)

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "_id": "6677xyz789",
    "name": "Gari",
    "price": 5000,
    "producer_id": {...},
    "traceability_id": {
      "_id": "6688def456",
      "farm_name": "Coop SCOOP",
      "cultivation_method": "bio",
      "certifications": [
        {
          "name": "Bio Certifié",
          "issuer": "IVOIREBIO"
        }
      ],
      "is_verified": true
    }
  }
}
```

---

**GET** `/products/{{product_id}}/traceability` (fiche traçabilité publique)

---

#### 3️⃣ **Panier**

**GET** `/cart` (🔒 Protected)
```
Header: Authorization: Bearer {{access_token}}
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "_id": "6688cart123",
    "user_id": "6677user789",
    "items": [
      {
        "_id": "item1",
        "product_id": "6677xyz789",
        "name": "Gari",
        "price_snapshot": 5000,
        "qty": 2
      }
    ],
    "updated_at": "2025-03-20T14:30:00Z"
  }
}
```

---

**POST** `/cart/items` (🔒 Protected)
```json
{
  "product_id": "6677xyz789",
  "qty": 2
}
```

**Réponse (201):**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "_id": "6688cart123"
  },
  "meta": {
    "message": "Article ajouté au panier"
  }
}
```

**Erreurs possibles:**
- ❌ `400 BAD_REQUEST` - product_id ou qty manquants
- ❌ `404 NOT_FOUND` - Produit n'existe pas
- ❌ `400 OUT_OF_STOCK` - Stock insuffisant

---

**PATCH** `/cart/items/{{product_id}}` (Modifier quantité)
```json
{
  "qty": 5
}
```

Si `qty = 0` → l'article est supprimé

---

**DELETE** `/cart/items/{{product_id}}` (Supprimer 1 article)

**DELETE** `/cart` (Vider tout le panier)

---

#### 4️⃣ **Commandes**

**POST** `/orders` (🔒 Protected) - **Passer une commande**
```json
{
  "delivery_address": {
    "full_name": "Kouassi Ama",
    "phone": "+229 90000000",
    "commune": "Cotonou",
    "quartier": "Zogbo",
    "indications": "Prés de la mosquée"
  },
  "delivery_type": "standard",
  "payment_method": "cash_on_delivery",
  "notes": "Livrer entre 14h et 16h"
}
```

**Valeurs acceptées:**
- `delivery_type`: `"standard"` | `"retrait_sur_place"`
- `payment_method`: `"kkiapay"` | `"cash_on_delivery"`

**Réponse (201):**
```json
{
  "success": true,
  "data": {
    "_id": "6688order456",
    "buyer_id": "6677user789",
    "items": [
      {
        "product_id": "6677xyz789",
        "name": "Gari",
        "price_at_order": 5000,
        "qty": 2,
        "subtotal": 10000
      }
    ],
    "total_amount": 10000,
    "status": "pending",
    "payment_status": "unpaid",
    "delivery_type": "standard",
    "created_at": "2025-03-20T15:00:00Z"
  }
}
```

✅ `order._id` est sauvegardé dans `{{order_id}}`

**❌ Erreurs possibles:**
- `400 EMPTY_CART` - Panier vide
- `400 PRODUCT_UNAVAILABLE` - Produit indisponible
- `400 OUT_OF_STOCK` - Stock insuffisant
- `400 BAD_REQUEST` - Champs manquants

---

**GET** `/orders` (🔒 Protected) - **Mes commandes**
```
?page=1&limit=10&status=pending
```

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6688order456",
      "buyer_id": "6677user789",
      "items": [...],
      "total_amount": 10000,
      "status": "pending",
      "created_at": "2025-03-20T15:00:00Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

**GET** `/orders/{{order_id}}` (🔒 Protected) - **Détail commande**

---

**PATCH** `/orders/{{order_id}}/cancel` (🔒 Protected) - **Annuler commande**

⚠️ Fonctionne uniquement si `status = "pending"`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "_id": "6688order456",
    "status": "cancelled"
  },
  "meta": {
    "message": "Commande annulée"
  }
}
```

---

#### 5️⃣ **Dashboard Client**

**GET** `/orders/dashboard` (🔒 Protected)

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "orders_total": 12,
    "orders_pending": 2,
    "orders_confirmed": 3,
    "orders_shipped": 4,
    "orders_delivered": 2,
    "orders_cancelled": 1,
    "total_spent": 250000
  }
}
```

---

## ❌ Codes d'Erreur Standardisés

| Code HTTP | Error Code | Situation |
|-----------|-----------|-----------|
| **400** | `BAD_REQUEST` | Paramètres invalides |
| **400** | `INVALID_EMAIL` | Format email incorrect |
| **400** | `WEAK_PASSWORD` | Mot de passe < 8 caractères |
| **400** | `EMAIL_EXISTS` | Email déjà utilisé |
| **400** | `INVALID_ROLE` | Role invalide |
| **400** | `EMPTY_CART` | Panier vide |
| **400** | `OUT_OF_STOCK` | Stock insuffisant |
| **400** | `PRODUCT_UNAVAILABLE` | Produit n'existe pas |
| **401** | `INVALID_TOKEN` | Token JWT invalide |
| **401** | `NO_TOKEN` | Token non fourni |
| **403** | `ACCOUNT_INACTIVE` | Compte suspendu |
| **403** | `FORBIDDEN` | Pas d'accès à cette ressource |
| **404** | `NOT_FOUND` | Ressource non trouvée |
| **500** | `INTERNAL_SERVER_ERROR` | Erreur serveur |

---

## 🎯 Checklist de Test

- [ ] ✅ Register & Login
- [ ] ✅ Lister produits (pagination)
- [ ] ✅ Voir traçabilité d'un produit
- [ ] ✅ Ajouter au panier
- [ ] ✅ Modifier quantité panier
- [ ] ✅ Voir panier
- [ ] ✅ Passer commande
- [ ] ✅ Voir historique commandes
- [ ] ✅ Voir details commande
- [ ] ✅ Annuler commande (pending)
- [ ] ✅ Dashboard client
- [ ] ✅ Erreur: Stock insuffisant
- [ ] ✅ Erreur: Token invalide

---

## 💡 Tips Postman

1. **Sauvegarder automatiquement**: Dans les onglets "Tests" des requêtes, les variables sont sauvegardées automatiquement
   
2. **Afficher les logs**: Dans Postman, allez à **View > Show Postman Console** pour voir les logs

3. **Scripts Pre-request**: Personnalisez les requêtes avant envoi

4. **Assertions**: Les scripts "Tests" vérifient les réponses automatiquement

5. **Export résultats**: Run > Generate Report

---

## 🔗 Lien Utiles

- [Documentation Postman](https://learning.postman.com/)
- [Collection Runner](https://learning.postman.com/docs/running-collections/intro-to-collection-runs/)
- [Tests et Scripts](https://learning.postman.com/docs/writing-scripts/intro-to-scripts/)

---

**Besoin d'aide?** Ouvrez l'issue GitHub ou consultez les commentaires dans la collection!

✅ **Prêt à tester!** 🚀
