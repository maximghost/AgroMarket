
// App.jsx
// C'est le point d'entrée de l'application
// BrowserRouter gère la navigation entre les pages
// Routes/Route définissent quelle page afficher selon l'URL

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Catalogue from './pages/Catalogue'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* "/" = page d'accueil → on affiche le Catalogue */}
        {/* Plus tard tu ajouteras d'autres routes ici */}
        <Route path="/" element={<Catalogue />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App