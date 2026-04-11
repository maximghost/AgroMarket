import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'

import producteurRoutes from './routes/producteurRoutes.js'

import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import traceabilityRoutes from './routes/traceabilityRoutes.js'

dotenv.config()
connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Routes principales
app.use('/users', userRoutes)
app.use('/producteurs', producteurRoutes)

// Routes avec préfixe /api/v1
const API_PREFIX = '/api/v1'

app.use(`${API_PREFIX}/auth`, authRoutes)
app.use(`${API_PREFIX}/users`, userRoutes)
app.use(`${API_PREFIX}/products`, productRoutes)
app.use(`${API_PREFIX}/cart`, cartRoutes)
app.use(`${API_PREFIX}/orders`, orderRoutes)
app.use(`${API_PREFIX}/traceability`, traceabilityRoutes)


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
