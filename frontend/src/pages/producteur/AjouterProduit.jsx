import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SHARED = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
  :root{--soil:#1a1208;--bark:#2c1f0e;--moss:#4a5e2a;--leaf:#6b8f3e;--sage:#8fb85a;--cream:#f5efe6;--sand:#e8d9c4;--amber:#c8873a;--light:#fdfaf6;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Space Grotesk',sans-serif;}
`;

const inputClass = (err) => `form-input ${err ? 'has-error' : ''}`;

export default function AjouterProduit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nom:'', description:'', prix:'', unite:'kg', stock:'',
    categorie:'legumes', origine:'', lot:'',
    dateProduction:'', dateExpiration:'', image: null
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      // gestion spécifique pour le fichier
      setForm(f => ({ ...f, image: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.nom.trim())        e.nom = 'Nom requis';
    if (!form.prix || +form.prix <= 0) e.prix = 'Prix valide requis';
    if (form.stock === '' || +form.stock < 0) e.stock = 'Stock valide requis';
    if (!form.origine.trim())    e.origine = 'Origine requise';
    if (!form.lot.trim())        e.lot = 'Numéro de lot requis';
    if (!form.dateProduction)    e.dateProduction = 'Date de production requise';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", form.nom);
      formData.append("description", form.description);
      formData.append("price", parseFloat(form.prix));
      formData.append("unit", form.unite);
      formData.append("stock_qty", parseInt(form.stock, 10));
      formData.append("category", form.categorie);
      formData.append("commune", form.origine);
      formData.append("lot", form.lot);
      formData.append("dateProduction", form.dateProduction);
      formData.append("dateExpiration", form.dateExpiration);

      if (form.image) {
        formData.append("image", form.image);
      }

      const res = await fetch("http://localhost:5000/producteurs/produits", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) throw new Error("Erreur lors de la création du produit");
      const data = await res.json();

      console.log("Produit créé:", data);
      setLoading(false);
      navigate("/producteur/produits");
    } catch (err) {
      console.error("Erreur:", err);
      setLoading(false);
    }
  };

  return (
    <>
      <style>{SHARED}{`
        .page-header { margin-bottom: 28px; }
        .page-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 4vw, 32px);
          font-weight: 900;
          color: var(--soil);
        }
        .page-sub { font-size: 13px; color: #9a8a7a; margin-top: 5px; }

        .form-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .form-section {
          padding: 28px 28px 24px;
          border-bottom: 1px solid var(--cream);
        }
        .form-section:last-child { border-bottom: none; }
        .section-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--leaf);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-title span { font-size: 16px; }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media(min-width:600px){ .form-grid { grid-template-columns: 1fr 1fr; } }
        .col-2 { grid-column: 1 / -1; }

        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--soil);
          letter-spacing: 0.3px;
        }
        .form-label .req { color: var(--amber); margin-left: 3px; }

        .form-input {
          width: 100%;
          border: 1.5px solid var(--sand);
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 14px;
          font-family: 'Space Grotesk', sans-serif;
          color: var(--soil);
          background: #fff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          outline: none;
        }
        .form-input:focus {
          border-color: var(--leaf);
          box-shadow: 0 0 0 3px rgba(107,143,62,0.12);
        }
        .form-input.has-error {
          border-color: #c06040;
          box-shadow: 0 0 0 3px rgba(192,96,64,0.1);
        }
        .form-error { font-size: 11px; color: #c06040; font-weight: 500; }

        .price-row { display: flex; gap: 8px; }
        .price-row .form-input { flex: 1; }
        .price-row select { width: 100px; flex-shrink: 0; }

        .alert-warning {
          background: rgba(200,135,58,0.08);
          border: 1px solid rgba(200,135,58,0.25);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 12.5px;
          color: #9a6020;
          margin-bottom: 20px;
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          flex-wrap: wrap;
          padding: 24px 28px;
          background: var(--cream);
        }
        .btn-cancel {
          padding: 11px 22px;
          border-radius: 10px;
          border: 1.5px solid var(--sand);
          background: #fff;
          color: var(--soil);
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Space Grotesk', sans-serif;
          transition: all 0.15s ease;
        }
        .btn-cancel:hover { background: var(--sand); }
        .btn-submit {
          padding: 11px 28px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, var(--moss), var(--leaf));
          color: #fff;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Space Grotesk', sans-serif;
          box-shadow: 0 4px 14px rgba(74,94,42,0.3);
          transition: all 0.2s ease;
          letter-spacing: 0.3px;
        }
        .btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(74,94,42,0.4); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
      `}</style>

      <div>
        <div className="page-header">
          <h1 className="page-title">Ajouter un produit</h1>
          <p className="page-sub">Renseignez les informations de votre nouveau produit</p>
        </div>

        <form onSubmit={handleSubmit} className="form-card">

          {/* Section 1 */}
          <div className="form-section">
            <div className="section-title"><span>◈</span> Informations générales</div>
            <div className="form-grid">

              <div className="form-field col-2">
                <label className="form-label">Nom du produit<span className="req">*</span></label>
                <input name="nom" value={form.nom} onChange={handleChange}
                  className={inputClass(errors.nom)} placeholder="Ex: Tomates bio" />
                {errors.nom && <span className="form-error">{errors.nom}</span>}
              </div>

              <div className="form-field col-2">
                <label className="form-label">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  rows={3} className="form-input" style={{resize:'vertical'}}
                  placeholder="Décrivez votre produit..." />
              </div>

              <div className="form-field">
                <label className="form-label">Prix & unité<span className="req">*</span></label>
                <div className="price-row">
                  <input type="number" step="0.01" name="prix" value={form.prix} onChange={handleChange}
                    className={inputClass(errors.prix)} placeholder="0.00" />
                  <select name="unite" value={form.unite} onChange={handleChange} className="form-input">
                    {['kg','g','L','pièce','pot','botte'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                {errors.prix && <span className="form-error">{errors.prix}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">Stock disponible<span className="req">*</span></label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange}
                  className={inputClass(errors.stock)} placeholder="0" />
                {errors.stock && <span className="form-error">{errors.stock}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">Catégorie</label>
                <select name="categorie" value={form.categorie} onChange={handleChange} className="form-input">
                  <option value="legumes">Légumes</option>
                  <option value="fruits">Fruits</option>
                  <option value="produits_laitiers">Produits laitiers</option>
                  <option value="viandes">Viandes</option>
                  <option value="miel_confitures">Miel & Confitures</option>
                  <option value="boissons">Boissons</option>
                  <option value="autres">Autres</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Photo du produit</label>
                <input type="file" accept="image/*" className="form-input"
                  style={{padding:'8px 14px', cursor:'pointer'}}
                  onChange={e => setForm(f => ({ ...f, image: e.target.files[0] }))} />
              </div>

            </div>
          </div>

          {/* Section 2 */}
          <div className="form-section">
            <div className="section-title"><span>◎</span> Traçabilité<span className="req" style={{fontSize:11,fontWeight:400,textTransform:'none',letterSpacing:0}}>obligatoire</span></div>
            <div className="alert-warning">⚠ Ces informations garantissent la traçabilité de vos produits auprès des consommateurs.</div>
            <div className="form-grid">

              <div className="form-field">
                <label className="form-label">Origine / lieu de production<span className="req">*</span></label>
                <input name="origine" value={form.origine} onChange={handleChange}
                  className={inputClass(errors.origine)} placeholder="Ex: Bénin, Cotonou" />
                {errors.origine && <span className="form-error">{errors.origine}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">Numéro de lot<span className="req">*</span></label>
                <input name="lot" value={form.lot} onChange={handleChange}
                  className={inputClass(errors.lot)} placeholder="Ex: LOT-2024-001" />
                {errors.lot && <span className="form-error">{errors.lot}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">Date de production<span className="req">*</span></label>
                <input type="date" name="dateProduction" value={form.dateProduction} onChange={handleChange}
                  className={inputClass(errors.dateProduction)} />
                {errors.dateProduction && <span className="form-error">{errors.dateProduction}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">Date d'expiration <span style={{color:'#9a8a7a',fontWeight:400}}>(optionnel)</span></label>
                <input type="date" name="dateExpiration" value={form.dateExpiration} onChange={handleChange}
                  className="form-input" />
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/producteur/produits')}>
              Annuler
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? '⏳ Enregistrement...' : '⊕ Ajouter le produit'}
            </button>
          </div>

        </form>
      </div>
    </>
  );
}