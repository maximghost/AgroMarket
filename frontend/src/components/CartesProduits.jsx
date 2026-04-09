export default function CartesProduits({ produit }) {
  // "produit" contient : nom, prix, note, avis, localisation, image, categorie

  return (
    // Carte avec ombre et coins arrondis
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">

      {/* ===== ZONE IMAGE ===== */}
      {/* C'est ici que tu mettras la vraie image quand tu auras les données */}
      <div className="relative">
        <img
          src={produit.images}        /* ← l'URL de l'image du produit */
          alt={produit.name}          /* ← texte alternatif pour accessibilité */
          className="w-full h-48 object-cover" /> {/* hauteur fixe, image recadrée */}
        

        {/* Badge vert "Produit au Bénin" en haut à gauche de l'image */}
        <span className="absolute top-3 left-3 bg-green-700 text-white text-xs px-3 py-1 rounded-full">
          📍 Produit au Bénin
        </span>
      </div>

      {/* ===== ZONE INFOS ===== */}
      <div className="p-4 flex flex-col flex-1">

        {/*Ligne 1 : nom du produit à gauche, localisation à droite */}
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-base">{produit.name}</h3>
          {/*Modifie ici si la localisation vient d'ailleurs */}
          <span className="text-gray-500 text-sm">📍 {produit.localisation}</span>
        </div>

        {/* Ligne 2 : étoiles + note à gauche, prix à droite */}
        <div className="flex justify-between items-center mb-4">
          {/* Étoiles : on répète ★ autant de fois que la note arrondie */}
          <span className="text-yellow-400 text-sm">
            {'★'.repeat(Math.floor(produit.note))}
            {'☆'.repeat(5 - Math.floor(produit.note))}
            {' '}{produit.note} ({produit.description})
          </span>

          {/* Prix en bleu gras */}
          {/* ← C'est ici que tu changes la devise ou l'unité */}
          <span className="text-blue-700 font-bold">
            {produit.price} FCFA
            <span className="text-sm font-normal">/kg</span>
          </span>
        </div>

        {/* Bouton Ajouter au panier — prend toute la largeur */}
        {/* ← Tu brancheras ici la fonction panier plus tard */}
        <button
          onClick={() => alert(`${produit.name} ajouté au panier !`)}
          className="mt-auto w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition">
          Ajouter Au Panier
        </button>

      </div>
    </div>
  )
}