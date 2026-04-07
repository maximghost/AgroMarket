#!/bin/bash

echo " Setup du projet AgroMarket..."

cd /mnt/c/Users/HP/Desktop/AgroMarket || exit

# =========================
# BACKEND
# =========================
echo "📦 Setup backend..."

cd backend || exit

pnpm init -y

pnpm add express mongoose dotenv cors
pnpm add -D nodemon

mkdir -p src/{config,models,controllers,routes,middlewares,services,utils}
touch src/app.js
touch .env

echo "PORT=5000" > .env
echo "MONGO_URI=mongodb://localhost:27017/agromarket" >> .env

cd ..

# =========================
# FRONTEND
# =========================
echo "🎨 Setup frontend..."

rm -rf frontend
pnpm create vite frontend --template react

cd frontend || exit
pnpm install

cd ..

echo "✅ Setup terminé"
