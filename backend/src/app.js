import express from 'express'
import cors from 'cors'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    message: '✅ Serveur actif et connecté',
    status: 'running',
    timestamp: new Date()
  })
})

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur AgroMarket API',
    version: '1.0.0'
  })
})

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.path
  })
})

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur:', err)
  res.status(500).json({
    error: 'Erreur serveur',
    message: err.message
  })
})

export default app
