// Elle importe ProductCard et l'utilise pour chaque produit

import { useState } from 'react'
import CartesProduits from '../components/CartesProduits'

const imagesPates = import.meta.glob('../assets/images/pates/*', { eager: true })
const imagesSauces = import.meta.glob('../assets/images/sauces/*', { eager: true })
const imagesPlats = import.meta.glob('../assets/images/plats_complets/*', { eager: true })
const imagesGrillades = import.meta.glob('../assets/images/grillades/*', { eager: true })
const imagesBouillies = import.meta.glob('../assets/images/bouillies/*', { eager: true })
const imagesBoissons= import.meta.glob('../assets/images/boissons/*', { eager: true })
const imagesAccompagnements= import.meta.glob('../assets/images/accompagnements/*', { eager: true })

const getPates = (fichier) => imagesPates[`../assets/images/pates/${fichier}`]?.default
const getSauces = (fichier) => imagesSauces[`../assets/images/sauces/${fichier}`]?.default
const getPlats = (fichier) => imagesPlats[`../assets/images/plats_complets/${fichier}`]?.default
const getGrillades = (fichier) => imagesGrillades[`../assets/images/grillades/${fichier}`]?.default
const getBouillies = (fichier) => imagesBouillies[`../assets/images/bouillies/${fichier}`]?.default
const getBoissons = (fichier) => imagesBoissons[`../assets/images/boissons/${fichier}`]?.default
const getAccompagnements= (fichier) => imagesAccompagnements[`../assets/images/accompagnements/${fichier}`]?.default

// useState : hook React qui permet de stocker une valeur qui peut changer
// Par exemple : la catégorie sélectionnée, le texte de recherche

// ===== DONNÉES FICTIVES =====
// En attendant le modèle de données de ta collègue
// Quand tu auras l'API, tu remplaceras ce tableau par un appel fetch()
const produits = [
  {
    _id: 1,
    name: 'Ablo',
    price: 1500,
    note: 4.8,
    description: 124,
    localisation: 'Comè',
    category: 'Accompagnements',
    // ← Remplace cette URL par la vraie image quand tu l'auras
    images: getAccompagnements('ablo.jpg')
  },
  {
    _id: 2,
    name: 'Aloco',
    price: 1500,
    note: 4.8,
    description: 'Banane frit',
    localisation: 'Cotonou',
    category: 'Accompagnements',
    images: getAccompagnements('aloko.jpg')
  },
  {
    _id: 3,
    name: 'Beignets',
    price: 1500,
    note: 4.8,
    description: 124,
    localisation: 'Abomey-Calavi',
    category: 'Accompagnements',
    images: getAccompagnements('beignets.jpeg')
  },
  {
    id: 4,
    name: 'Kléklé',
    price: 1500,
    note: 4.8,
    description: 'Une petite galette croustillant ',
    localisation: 'Porto-Novo',
    category: 'Accompagnements',
    images: getAccompagnements('klekle.jpg')
  },
  {
    id: 5,
    name: 'Toubani',
    price: 1500,
    note: 4.8,
    description: 'Mets traditionnel du nord du Bénin et du Niger, cuit à la vapeur, à base de farine de haricot (souvent du niébé) et parfois mélangé à de l\'igname ou du manioc',
    localisation: 'Djougou/Natitingou',
    category: 'Accompagnements',
    images: getAccompagnements('toubani.jpg')
  },
  {
    id: 6,
    name: 'Adoyo',
    price: 1500,
    note: 4.8,
    description: 'Connue comme boisson de rue, à base d\'eau fermentée d\'amidon de maïs, de peau d\'ananas et de citronnelle.',
    localisation: 'Porto-Novo',
    category: 'Boissons',
    images: getBoissons('adoyo.webp')
  },
  {
    id: 7,
    name: 'Atan (Vin de palme frais)',
    price: 1500,
    note: 4.8,
    description: 'Boisson alcoolisée traditionnelle, obtenue par la fermentation naturelle de la sève de divers palmiers',
    localisation: 'Ouémé/Zè',
    category: 'Boissons',
    images: getBoissons('atan.jpg')
  },
  {
    id: 8,
    name: 'Bissap',
    price: 1500,
    note: 4.8,
    description: 'Boisson traditionnelle d\'Afrique de l\'Ouest, préparée par infusion ou ébullition des calices séchés de l\'hibiscus',
    localisation: 'Cotonou',
    category: 'Boissons',
    images: getBoissons('bissap.jpg')
  },
   {
    id: 9,
    name: 'Sodabi',
    price: 1500,
    note: 5,
    description: 'Boisson obtenue par distillation de vin de palme fermenté ',
    localisation: 'Cotonou',
    category: 'Boissons',
    images: getBoissons('sodabi.jpg')
  },
  {
    id: 10,
    name: 'Jus de tamarin',
    price: 1500,
    note: 5,
    description: 'Boisson rafraîchissante et exotique, réputée pour son goût acidulé, sucré et complexe, obtenu à partir de la pulpe du fruit du tamarinier',
    localisation: 'Port-Novo',
    category: 'Boissons',
    images: getBoissons('tamarin.jpg')
  },
  {
    id: 11,
    name: 'Tchakpalo',
    price: 1500,
    note: 5,
    description: 'Une bière traditionnelle produite par la fermentation de céréales comme le maïs, le sorgho ou le mil',
    localisation: 'Djougou/Malanville',
    category: 'Boissons',
    images: getBoissons('tchakpalo.jpg')
  },
  {
    id: 12,
    name: 'Tchoukoutou',
    price: 1500,
    note: 5,
    description: 'Une bière traditionnelle artisanale très prisée, fabriquée à base de sorgho ou de mil.',
    localisation: 'Natitingou/Boukoumbé',
    category: 'Boissons',
    images: getBoissons('tchoukoutou.jpg')
  },
  {
    id: 13,
    name: 'Aklui',
    price: 1500,
    note: 5,
    description:'bouillie traditionnelle fermentée, préparée à base de maïs granulé (farine fermentée et roulée)',
    localisation: 'Au Sud',
    category: 'Bouillies',
    images: getBouillies('aklui.jpg')
  },
  {
    id: 14,
    name: 'Bouillie de Gari',
    price: 1500,
    note: 5,
    description: 124,
    localisation: 'Allada/Zè',
    category: 'Bouillies',
    images: getBouillies('gari.jpg')
  },
  {
    id: 15,
    name: 'Bouille de mil',
    price: 1500,
    note: 5,
    description: 124,
    localisation: 'Zones urbaines',
    category: 'Bouillies',
    images: getBouillies('mil.jpg')
  },
  {
    id: 16,
    name: 'Bouillie de soja',
    price: 1500,
    note: 5,
    description:124,
    localisation: 'Abomey-Calavi/ Bohicon',
    category: 'Bouillies',
    images: getBouillies('soja.jpg')
  },
  {
    id: 17,
    name: 'Viande d\'agouti',
    price: 1500,
    note: 5,
    description:124,
    localisation: 'Sô-Ava/Ganvié',
    category: 'Grillades/Proteïnes',
    images: getGrillades('agouti.jpeg')
  },
  {
    id: 18,
    name: 'Brochettes de viande(Massa)',
    price: 1500,
    note: 5,
    
    localisation: 'Djougou/Parakou',
    category: 'Grillades/Proteïnes',
    images: getGrillades('brochettes.jpg')
  },
  {
    id: 19,
    name: 'Brochettes d\'escargot',
    price: 1500,
    note: 5,
    
    localisation: 'Abomey-Calavi/Allada/Savalou',
    category: 'Grillades/Proteïnes',
    images: getGrillades('escargot.jpg')
  },
  {
    id: 20,
    name: 'Wagashi(fromage)',
    price: 1500,
    note: 5,
    description:124,
    localisation: 'Parakou',
    category: 'Grillades/Proteïnes',
    images: getGrillades('fromage.jpg')
  },
  {
    id: 21,
    name: 'Hanlan',
    price: 1500,
    note: 5,
    description:'Viande de porc grillée',
    localisation: 'Porto-Novo',
    category: 'Grillades/Proteïnes',
    images: getGrillades('hanlan.jpg')
  },
  {
    id: 22,
    name: 'Méchoui local',
    price: 1500,
    note: 5,
    description:'Agneau ou un mouton entier rôti à la broche sur des braises de bois',
    localisation: 'Djougou/Banikoara',
    category: 'Grillades/Proteïnes',
    images: getGrillades('mechoui.jpg')
  },  
  {
    id: 23,
    name: 'Poisson pimenté au grill',
    price: 1500,
    note: 5,
    
    localisation: 'Ouidah/Cotonou',
    category: 'Grillades/Proteïnes',
    images: getGrillades('poisson.jpg')
  },  
  {
    id: 24,
    name: 'Tchatchanga',
    price: 1500,
    note: 5,
    description:'Spécialité de street food béninoise, principalement composée de grillades de viande (bœuf, mouton, poulet) marinées et épicées',
    localisation: 'Parakou/Kandi',
    category: 'Grillades/Proteïnes',
    images: getGrillades('tchatchanga.jpg')
  }, 
  {
    id: 25,
    name: 'Akassa',
    price: 1500,
    note: 5,
    
    localisation: 'Porto-Novo',
    category: 'Pâtes',
    images: getPates('akassa.jpg')
  },   
  {
    id: 26,
    name: 'Igname Pilé',
    price: 1500,
    note: 5,
    
    localisation: 'Parakou',
    category: 'Pâtes',
    images: getPates('igname_pilé.jpg')
  },   
  {
    id: 27,
    name: 'Pâte de maïs',
    price: 1500,
    note: 5,
    
    localisation: 'Abomey-Calavi',
    category: 'Pâtes',
    images: getPates('pate.jpg')
  },   
  {
    id: 28,
    name: 'Piron',
    price: 1500,
    note: 5,
    description : 'Plat à base de gari (semoule de manioc fermentée)',
    localisation: 'Cotonou/Allada',
    category: 'Pâtes',
    images: getPates('piron.jpg')
  },   
  {
    id: 29,
    name: 'Telibo(pâte noire)',
    price: 1500,
    note: 5,
    description : 'Pâte alimentaire de couleur noire, réalisée à base de farine de cossettes d\'igname séchées ',
    localisation: 'Parakou/Savè',
    category: 'Pâtes',
    images: getPates('telibo.jpg')
  },   
  {
    id: 30,
    name: 'Amiwo',
    price: 1500,
    note: 5,
    description : 'Une pâte de maïs assaisonnée, cuite avec de la tomate concentrée, de l\'huile, de l\'ail, de l\'oignon et des épices',
    localisation: 'Parakou/Savè',
    category: 'Plats complets',
    images: getPlats('amiwo.jpg')
  },   
   {
    id: 31,
    name: 'Atassi',
    price: 1500,
    note: 5,
  
    localisation: 'Cotonou',
    category: 'Plats complets',
    images: getPlats('atassi.jpg')
  },   
   {
    id: 32,
    name: 'Dakouin',
    price: 1500,
    note: 5,
    description : 'Un plat traditionnel béninois, composé de gari (farine de manioc torréfiée) et de poisson frais',
    localisation: 'Grand-Popo',
    category: 'Plats complets',
    images: getPlats('dakouin.jpg')
  },   
  {
    id: 33,
    name: 'Dambou',
    price: 1500,
    note: 5,
    description : 'Spécialité culinaire, apparentée à un couscous, principalement à base de semoule de riz (ou parfois de mil/maïs) et de feuilles de moringa',
    localisation: 'Kandi/Malanville',
    category: 'Plats complets',
    images: getPlats('dambou.jpg')
  },   
  {
    id: 34,
    name: 'Riz au gras',
    price: 1500,
    note: 5,
    
    localisation: 'Cotonou',
    category: 'Plats complets',
    images: getPlats('riz_gras.jpg')
  },
  {
    id: 35,
    name: 'Wassa-wassa',
    price: 1500,
    note: 5,
    description : 'Un plat béninois traditionnel originaire du Nord, fait à base de cossettes d\'igname séchées',
    localisation: 'Djougou',
    category: 'Plats complets',
    images: getPlats('wassa.jpg')
  },    
  {
    id: 36,
    name: 'Sauce d\'arachide',
    price: 1500,
    note: 5,
    
    localisation: 'Abomey',
    category: 'Sauces',
    images: getSauces('arachide.jpg')
  },      
  {
    id: 37,
    name: 'Sauce de crin-crin',
    price: 1500,
    note: 5,
    
    localisation: 'Cotonou/Porto-Novo',
    category: 'Sauces',
    images: getSauces('crin-crin.jpg')
  },    
  {
    id: 38,
    name: 'Sauce feuille(Gboma,tchayo...)',
    price: 1500,
    note: 5,
    
    localisation: 'Natitingou/Abomey Calavi',
    category: 'Sauces',
    images: getSauces('feuille.jpg')
  },  
  {
    id: 39,
    name: 'Sauce gombo',
    price: 1500,
    note: 5,
    
    localisation: 'Mono/Couffo',
    category: 'Sauces',
    images: getSauces('gombo.jpg')
  },  
  {
    id: 40,
    name: 'Sauce graine',
    price: 1500,
    note: 5,
    description :'Préparé à base de jus de noix de palme fraîches ou en conserve.',
    localisation: 'Bohicon',
    category: 'Sauces',
    images: getSauces('graine.jpg')
  },               
  {
    id: 41,
    name: 'Sauce tomate',
    price: 1500,
    note: 5,
    description :'Préparation culinaire à base de tomates cuites, réduite en purée et assaisonnée',
    localisation: 'Porto-Novo',
    category: 'Sauces',
    images: getSauces('tomate.jpg')
  },                
]

// Les catégories du filtre en haut
// ← Ajoute ou modifie les catégories ici selon ce que vous décidez
const categories = ['Tous', 'Pâtes','Sauces', 'Plats complets', 'Accompagnements', 'Bouillies', 'Boissons', 'Grillades/Proteïnes']

export default function Catalogue() {
  // categorie : la catégorie actuellement sélectionnée (par défaut "Tous")
  const [category, setCategory] = useState('Tous')

  // recherche : le texte tapé dans la barre de recherche
  const [recherche, setRecherche] = useState('')

  // produitsFiltres : on filtre le tableau selon la recherche ET la catégorie
  const produitsFiltres = produits.filter(p => {
    // Est-ce que le nom contient le texte recherché ?
    const matchRecherche = p.name.toLowerCase().includes(recherche.toLowerCase())
    // Est-ce que la catégorie correspond ? Si "Tous" on prend tout
    const matchCategory = category === 'Tous' || p.category === category
    return matchRecherche && matchCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* ===== TITRE DE LA PAGE ===== */}
      <h1 className="text-3xl font-bold text-green-700 mb-6">Catalogue</h1>

      {/* ===== BARRE DE RECHERCHE ===== */}
      {/* relative/absolute : pour positionner l'icône loupe à l'intérieur */}
      <div className="relative mb-6 max-w-md">
        <input
          type="text"
          placeholder="Rechercher des produits..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          // ← onChange met à jour "recherche" à chaque lettre tapée
          className="w-full border border-gray-300 rounded-full px-5 py-2.5 pr-12 outline-none focus:border-green-600"
        />
        <span className="absolute right-4 top-2.5 text-gray-400 text-lg">🔍</span>
      </div>

      {/* ===== FILTRES CATÉGORIES ===== */}
      <div className="flex gap-3 mb-8">
        {/* On boucle sur le tableau categories pour créer un bouton par catégorie */}
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            // Si c'est la catégorie active → fond vert, sinon → fond gris
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              category === cat
                ? 'bg-green-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ===== GRILLE DE PRODUITS ===== */}
      {/* Sur mobile : 1 colonne, tablette : 2, desktop : 3 ou 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {produitsFiltres.map(produit => (
          // On passe chaque produit à ProductCard via la prop "produit"
          <CartesProduits key={produit._id} produit={produit} />
        ))}
      </div>

      {/* Message si aucun produit trouvé */}
      {produitsFiltres.length === 0 && (
        <p className="text-center text-gray-400 mt-12">Aucun produit trouvé.</p>
      )}

    </div>
  )
}