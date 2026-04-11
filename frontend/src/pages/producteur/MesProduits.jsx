import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SHARED = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
  :root{--soil:#1a1208;--bark:#2c1f0e;--humus:#3d2b14;--moss:#4a5e2a;--leaf:#6b8f3e;--sage:#8fb85a;--cream:#f5efe6;--sand:#e8d9c4;--amber:#c8873a;--gold:#e8a84a;--light:#fdfaf6;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Space Grotesk',sans-serif;}
`;


export default function MesProduits() {
  const [produits, setProduits] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/producteurs/produits", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => {
        // Adapter les champs backend vers ceux attendus par le frontend
        const mapped = data.map(p => ({
          id: p._id,
          nom: p.name,
          prix: typeof p.price === "number" ? p.price : 0,
          unite: p.unit,
          stock: p.stock_qty,
          emoji: "📦", // valeur par défaut si pas d’image
          lot: p.lot || p._id.slice(-6),
          origine: p.commune || "Local",
          statut: p.stock_qty > 0 ? "actif" : "rupture",
          images: p.images || []
        }));
        setProduits(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur produits:", err);
        setProduits([]); // évite le crash
        setLoading(false);
      });
  }, []);

  const handleSupprimer = (id) => {
    if (window.confirm('Supprimer ce produit ?')) setProduits(p => p.filter(x => x.id !== id));
  };

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh'}}>
      <div style={{width:36,height:36,border:'3px solid #e8d9c4',borderTop:'3px solid #6b8f3e',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <style>{SHARED}{`
        .mp-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .mp-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 4vw, 32px);
          font-weight: 900;
          color: var(--soil);
        }
        .mp-sub { font-size: 13px; color: #9a8a7a; margin-top: 4px; }

        .btn-add {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, var(--moss), var(--leaf));
          color: #fff;
          padding: 11px 20px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(74,94,42,0.3);
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .btn-add:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(74,94,42,0.4); }

        .products-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media(min-width:640px){ .products-grid { grid-template-columns: repeat(2,1fr); } }
        @media(min-width:1024px){ .products-grid { grid-template-columns: repeat(3,1fr); } }

        .product-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.06);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }

        .product-img {
          height: 140px;
          background: linear-gradient(135deg, var(--cream), var(--sand));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          position: relative;
        }
        .product-badge {
          position: absolute;
          top: 12px; right: 12px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .badge-actif   { background: rgba(107,143,62,0.15); color: var(--moss); }
        .badge-rupture { background: rgba(200,100,80,0.12); color: #c06040; }

        .product-body { padding: 18px; }
        .product-name {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--soil);
        }
        .product-price {
          font-size: 15px;
          font-weight: 600;
          color: var(--leaf);
          margin-top: 4px;
        }

        .product-meta {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid var(--sand);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .meta-row { display: flex; justify-content: space-between; font-size: 12px; }
        .meta-key { color: #9a8a7a; font-weight: 500; }
        .meta-val { color: var(--soil); font-weight: 600; }
        .meta-val.low { color: #c06040; }

        .product-actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }
        .btn-edit, .btn-del {
          flex: 1;
          padding: 9px 0;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          cursor: pointer;
          transition: all 0.15s ease;
          text-decoration: none;
          display: block;
          border: 1.5px solid;
        }
        .btn-edit {
          border-color: var(--sand);
          color: var(--soil);
          background: transparent;
        }
        .btn-edit:hover { background: var(--sand); }
        .btn-del {
          border-color: rgba(192,96,64,0.3);
          color: #c06040;
          background: transparent;
        }
        .btn-del:hover { background: rgba(192,96,64,0.08); }

        .empty-state {
          text-align: center;
          padding: 80px 24px;
          background: #fff;
          border-radius: 20px;
          border: 2px dashed var(--sand);
        }
        .empty-icon { font-size: 56px; margin-bottom: 16px; }
        .empty-text { font-size: 15px; color: #9a8a7a; margin-bottom: 20px; }
      `}</style>

      <div>
        <div className="mp-header">
          <div>
            <h1 className="mp-title">Mes Produits</h1>
            <p className="mp-sub">{produits.length} produit{produits.length !== 1 ? 's' : ''} dans votre catalogue</p>
          </div>
          <Link to="/producteur/produits/ajouter" className="btn-add">⊕ Ajouter un produit</Link>
        </div>

        {produits.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p className="empty-text">Aucun produit dans votre catalogue</p>
            <Link to="/producteur/produits/ajouter" className="btn-add" style={{display:'inline-flex'}}>
              ⊕ Ajouter votre premier produit
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {produits.map(p => (
              <div key={p.id} className="product-card">
                <div className="product-img">
                  {p.emoji}
                  <span className={`product-badge ${p.statut === 'actif' ? 'badge-actif' : 'badge-rupture'}`}>
                    {p.statut === 'actif' ? '● Actif' : '○ Rupture'}
                  </span>
                </div>
                <div className="product-body">
                  <div className="product-name">{p.nom}</div>
                  <div className="product-price">{p.prix.toFixed(2)} € / {p.unite}</div>
                  <div className="product-meta">
                    <div className="meta-row">
                      <span className="meta-key">Numéro de lot</span>
                      <span className="meta-val">{p.lot}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-key">Origine</span>
                      <span className="meta-val">{p.origine}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-key">Stock</span>
                      <span className={`meta-val ${p.stock < 10 ? 'low' : ''}`}>
                        {p.stock} {p.unite}
                      </span>
                    </div>
                  </div>
                  <div className="product-actions">
                    <Link to={`/producteur/produits/modifier/${p.id}`} className="btn-edit">
                      ✎ Modifier
                    </Link>
                    <button onClick={() => handleSupprimer(p.id)} className="btn-del">
                      ✕ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}