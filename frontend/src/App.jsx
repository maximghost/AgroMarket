import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('Chargement...')

  useEffect(() => {
    // Appel à l'API backend
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setMessage(data.message || 'Connecté au serveur'))
      .catch(() => setMessage('Serveur non disponible'))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <nav className="bg-green-700 text-white p-4 shadow-lg">
        <h1 className="text-3xl font-bold">🌾 AgroMarket</h1>
        <p className="text-green-100">Plateforme de mets locaux</p>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Bienvenue</h2>
          <p className="text-gray-600 mb-4">
            {message}
          </p>
          <button className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition">
            Commencer
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
