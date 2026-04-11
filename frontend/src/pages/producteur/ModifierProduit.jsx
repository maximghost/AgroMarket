import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SHARED = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
  :root{--soil:#1a1208;--bark:#2c1f0e;--moss:#4a5e2a;--leaf:#6b8f3e;--sage:#8fb85a;--cream:#f5efe6;--sand:#e8d9c4;--amber:#c8873a;--light:#fdfaf6;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Space Grotesk',sans-serif;}
`;


export default function ModifierProduit() {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState({
    nom:'', description:'', prix:'', unite:'kg', stock:'',
    categorie:'legumes', origine:'', lot:'',
    dateProduction:'', dateExpiration:'', statut:'actif', image: null
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/producteurs/produits/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Produit introuvable");
        return res.json();
      })
      .then(data => {
        // Adapter les champs backend vers ton form
        setForm({
          nom: data.name || "",
          description: data.description || "",
          prix: data.price || "",
          unite: data.unit || "kg",
          stock: data.stock_qty || "",
          categorie: data.category || "legumes",
          origine: data.commune || "",
          lot: data.lot || "",
          dateProduction: data.dateProduction || "",
          dateExpiration: data.dateExpiration || "",
          statut: data.is_available ? "actif" : "inactif",
          image: data.images?.[0] || null
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur produit:", err);
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      console.log('Produit modifié:', form);
      setSaving(false);
      navigate('/producteur/produits');
    }, 1000);
  };

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh'}}>
      <div style={{width:36,height:36,border:'3px solid #e8d9c4',borderTop:'3px solid #6b8f3e',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (notFound) return (
    <div style={{textAlign:'center',padding:'80px 24px'}}>
      <p style={{fontSize:48}}>📦</p>
      <p style={{marginTop:12,color:'#9a8a7a'}}>Produit introuvable.</p>
      <button onClick={() => navigate('/producteur/produits')} style={{marginTop:16,color:'var(--leaf)',background:'none',border:'none',cursor:'pointer',fontSize:14,fontWeight:600}}>
        ← Retour aux produits
      </button>
    </div>
  );

  const inputClass = (err) => `form-input ${err ? 'has-error' : ''}`;

  return (
    <>
      <style>{SHARED}{`
        .page-header { margin-bottom: 28px; display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
        .back-btn {
          background: none; border: 1.5px solid var(--sand);
          border-radius: 10px; padding: 8px 14px;
          font-size: 13px; font-weight: 600; color: var(--soil);
          cursor: pointer; font-family: 'Space Grotesk', sans-serif;
          transition: all 0.15s ease;
        }
        .back-btn:hover { background: var(--sand); }
        .page-title { font-family:'Playfair Display',serif; font-size:clamp(22px,4vw,32px); font-weight:900; color:var(--soil); }
        .page-sub   { font-size:13px; color:#9a8a7a; margin-top:5px; }

        .form-card   { background:#fff; border-radius:20px; border:1px solid rgba(0,0,0,0.06); overflow:hidden; }
        .form-section{ padding:28px 28px 24px; border-bottom:1px solid var(--cream); }
        .form-section:last-child { border-bottom:none; }

        .section-title { font-size:13px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--leaf); margin-bottom:20px; display:flex; align-items:center; gap:8px; }

        .form-grid { display:grid; grid-template-columns:1fr; gap:16px; }
        @media(min-width:600px){ .form-grid { grid-template-columns:1fr 1fr; } }
        .col-2 { grid-column:1/-1; }

        .form-field { display:flex; flex-direction:column; gap:6px; }
        .form-label { font-size:12px; font-weight:600; color:var(--soil); letter-spacing:0.3px; }
        .form-label .req { color:var(--amber); margin-left:3px; }

        .form-input { width:100%; border:1.5px solid var(--sand); border-radius:10px; padding:11px 14px; font-size:14px; font-family:'Space Grotesk',sans-serif; color:var(--soil); background:#fff; transition:border-color 0.2s,box-shadow 0.2s; outline:none; }
        .form-input:focus { border-color:var(--leaf); box-shadow:0 0 0 3px rgba(107,143,62,0.12); }
        .form-input.has-error { border-color:#c06040; box-shadow:0 0 0 3px rgba(192,96,64,0.1); }
        .form-error { font-size:11px; color:#c06040; font-weight:500; }
        .price-row { display:flex; gap:8px; }
        .price-row .form-input { flex:1; }
        .price-row select { width:100px; flex-shrink:0; }

        .alert-warning { background:rgba(200,135,58,0.08); border:1px solid rgba(200,135,58,0.25); border-radius:10px; padding:12px 16px; font-size:12.5px; color:#9a6020; margin-bottom:20px; display:flex; gap:8px; }

        .form-actions { display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap; padding:24px 28px; background:var(--cream); }
        .btn-cancel { padding:11px 22px; border-radius:10px; border:1.5px solid var(--sand); background:#fff; color:var(--soil); font-size:13.5px; font-weight:600; cursor:pointer; font-family:'Space Grotesk',sans-serif; transition:all 0.15s; }
        .btn-cancel:hover { background:var(--sand); }
        .btn-submit { padding:11px 28px; border-radius:10px; border:none; background:linear-gradient(135deg,var(--moss),var(--leaf)); color:#fff; font-size:13.5px; font-weight:700; cursor:pointer; font-family:'Space Grotesk',sans-serif; box-shadow:0 4px 14px rgba(74,94,42,0.3); transition:all 0.2s; letter-spacing:0.3px; }
        .btn-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 20px rgba(74,94,42,0.4); }
        .btn-submit:disabled { opacity:0.6; cursor:not-allowed; }
      `}</style>

      <div>
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/producteur/produits')}>← Retour</button>
          <div>
            <h1 className="page-title">Modifier le produit</h1>
            <p className="page-sub">ID #{id} · Modifiez les informations ci-dessous</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-card">

          <div className="form-section">
            <div className="section-title"><span>◈</span> Informations générales</div>
            <div className="form-grid">

              <div className="form-field col-2">
                <label className="form-label">Nom du produit<span className="req">*</span></label>
                <input name="nom" value={form.nom} onChange={handleChange} className={inputClass(errors.nom)} />
                {errors.nom && <span className="form-error">{errors.nom}</span>}
              </div>

              <div className="form-field col-2">
                <label className="form-label">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  rows={3} className="form-input" style={{resize:'vertical'}} />
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
                <label className="form-label">Stock<span className="req">*</span></label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange}
                  className={inputClass(errors.stock)} />
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
                <label className="form-label">Statut</label>
                <select name="statut" value={form.statut} onChange={handleChange} className="form-input">
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="rupture">Rupture de stock</option>
                </select>
              </div>

              <div className="form-field col-2">
                <label className="form-label">Changer la photo</label>
                <input type="file" accept="image/*" className="form-input" style={{padding:'8px 14px',cursor:'pointer'}}
                  onChange={e => setForm(f => ({ ...f, image: e.target.files[0] }))} />
                <span style={{fontSize:11,color:'#9a8a7a'}}>Laisser vide pour conserver l'image actuelle</span>
              </div>

            </div>
          </div>

          <div className="form-section">
            <div className="section-title"><span>◎</span> Traçabilité</div>
            <div className="alert-warning">⚠ Informations obligatoires pour garantir la traçabilité.</div>
            <div className="form-grid">

              <div className="form-field">
                <label className="form-label">Origine / lieu de production<span className="req">*</span></label>
                <input name="origine" value={form.origine} onChange={handleChange} className={inputClass(errors.origine)} />
                {errors.origine && <span className="form-error">{errors.origine}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">Numéro de lot<span className="req">*</span></label>
                <input name="lot" value={form.lot} onChange={handleChange} className={inputClass(errors.lot)} />
                {errors.lot && <span className="form-error">{errors.lot}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">Date de production<span className="req">*</span></label>
                <input type="date" name="dateProduction" value={form.dateProduction} onChange={handleChange} className={inputClass(errors.dateProduction)} />
                {errors.dateProduction && <span className="form-error">{errors.dateProduction}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">Date d'expiration <span style={{color:'#9a8a7a',fontWeight:400}}>(optionnel)</span></label>
                <input type="date" name="dateExpiration" value={form.dateExpiration} onChange={handleChange} className="form-input" />
              </div>

            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/producteur/produits')}>Annuler</button>
            <button type="submit" className="btn-submit" disabled={saving}>
              {saving ? '⏳ Enregistrement...' : '✓ Enregistrer les modifications'}
            </button>
          </div>

        </form>
      </div>
    </>
  );
}