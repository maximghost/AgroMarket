# Configuration KKiaPay - Guide Setup Sandbox

## 1. Installation ✅
La dépendance KKiaPay a été installée via `pnpm add kkiapay`

## 2. Configuration Variables d'Environnement

### Frontend (.env ou .env.local)

```env
VITE_KKIAPAY_MODE=sandbox
VITE_KKIAPAY_PUBLIC_KEY=your_sandbox_public_key_here
VITE_KKIAPAY_SECRET_KEY=your_sandbox_secret_key_here
```

### Comment obtenir les clés (Sandbox)

1. **Créer un compte KKiaPay:**
   - Allez sur https://app.kkiapay.com/
   - Cliquez sur "S'inscrire"
   - Remplissez le formulaire avec email, mot de passe

2. **Accéder aux clés API:**
   - Une fois connecté, allez à **Settings** → **API Keys**
   - Vous verrez deux sections:
     - **Sandbox Keys** (pour les tests) ← À utiliser d'abord
     - **Live Keys** (pour production)
   - Copiez la clé publique et secrète du Sandbox

3. **Ajouter aux variables d'environnement:**
   ```env
   VITE_KKIAPAY_PUBLIC_KEY=pk_sandbox_xxxxxxxxxxxxx
   VITE_KKIAPAY_SECRET_KEY=sk_sandbox_xxxxxxxxxxxxx
   ```

## 3. Numéros de Test en Mode Sandbox

Pour tester les paiements en Sandbox, utilisez:

### Test Numéros Valides:
- **229XXXXXXXX** (Numéro Bénin - à remplacer par vrai numéro Bénin)
- Format: 229 + 8 chiffres

### Statuts de Réponse:
- **0** = Succès
- **1** = Erreur

### Montants:
N'importe quel montant fonctionnera en Sandbox

## 4. Utilisation sur le Frontend

### CartPage Integration:
```jsx
// Le bouton "Procéder au paiement" lance le widget KKiaPay
// - Lance le widget de paiement
// - Utilisateur remplit ses données
// - Saisit le montant
// - Confirme le paiement
```

### Flux de Paiement:
1. Client clique "Procéder au paiement"
2. Widget KKiaPay s'ouvre
3. Client saisit:
   - Téléphone (déjà pré-rempli du profil)
   - Montant (auto-calculé)
4. Après confirmation réussie:
   - Callback `onPaymentSuccess` est déclenché
   - Toast de succès s'affiche

## 5. Passage à Production

Pour passer en mode LIVE:

1. **Obtenir les clés Live:**
   - Allez à Settings → API Keys
   - Copiez les clés Live

2. **Mettre à jour les variables:**
   ```env
   VITE_KKIAPAY_MODE=live
   VITE_KKIAPAY_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
   VITE_KKIAPAY_SECRET_KEY=sk_live_xxxxxxxxxxxxx
   ```

3. **Vérifier les numéros de téléphone:**
   - Chaque client doit avoir un numéro valide en `user.phone`
   - Format: format international (229xxxxxxxx pour Bénin)

## 6. Fichiers Créés/Modifiés

✅ **Services/Hooks créés:**
- `frontend/src/services/kkiapayService.js` - Service KKiaPay
- `frontend/src/hooks/useKkiapay.js` - Hook custom

✅ **Fichiers modifiés:**
- `frontend/src/pages/CartPage.jsx` - Intégration du widget
- `frontend/.env.example` - Variables d'environnement ajoutées

## 7. Dépannage

### Erreur: "Widget not loading"
- Vérifier les clés API dans .env
- S'assurer que mode=sandbox pour les tests

### Erreur: "Invalid phone number"
- Le format doit être 229xxxxxxxx (10 chiffres)
- Vérifier que `user.phone` est correctement sauvegardé

### Paiement ne confirme pas
- En Sandbox, les paiements visent à être réussis
- Vérifier la console pour les erreurs

## 8. Prochaines Étapes (À faire)

1. **Backend Integration:**
   - Créer endpoint POST /orders pour créer la commande
   - Vérifier le paiement via API KKiaPay
   - Sauvegarder la transaction

2. **Order Management:**
   - Créer page de confirmation de commande
   - Ajouter historique des commandes
   - Notification au producteur

3. **Webhook:**
   - Configurer webhook KKiaPay pour notifications
   - Mettre à jour le statut de la commande automatiquement
