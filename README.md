# AgroMarket - Plateforme E-commerce de Mets Locaux

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** >= 16.x
- **pnpm** : `npm install -g pnpm`
- **MongoDB** actif sur `localhost:27017`

### Installation & Lancement

**Terminal 1 - Backend:**
```bash
cd backend
pnpm install
cp .env.example .env
pnpm dev
```
→ Serveur: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm install
cp .env.example .env.local
pnpm dev
```
→ App: http://localhost:5173

---

## 📁 Structure

```
backend/       API Express + MongoDB
frontend/      React + Tailwind CSS
```

## 🔌 API Health Check

```bash
curl http://localhost:5000/api/health
```
