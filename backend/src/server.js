import 'dotenv/config.js'
import app from './app.js'
import connectDB from './config/database.js'

const PORT = process.env.PORT || 5000

// Connexion à la base de données
await connectDB()

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(` Serveur actif sur http://localhost:${PORT}`)
})
