import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SHARED = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
  :root{--soil:#1a1208;--bark:#2c1f0e;--moss:#4a5e2a;--leaf:#6b8f3e;--sage:#8fb85a;--cream:#f5efe6;--sand:#e8d9c4;--amber:#c8873a;--light:#fdfaf6;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Space Grotesk',sans-serif;}
`;

const STATUT_CONFIG = {
  en_attente:{ label:'En attente', color:'#c8873a', bg:'rgba(200,135,58,0.1)', border:'rgba(200,135,58,0.25)', dot:'#c8873a' },
  confirmee: { label:'Confirmée',  color:'#3a7bc8', bg:'rgba(58,123,200,0.1)', border:'rgba(58,123,200,0.25)', dot:'#3a7bc8' },
  expediee:  { label:'Expédiée',   color:'#7b3ac8', bg:'rgba(123,58,200,0.1)', border:'rgba(123,58,200,0.25)', dot:'#7b3ac8' },
  livree:    { label:'Livrée',     color:'#3a8f4a', bg:'rgba(58,143,74,0.1)',  border:'rgba(58,143,74,0.25)',  dot:'#3a8f4a' },
  rejetee:   { label:'Rejetée',    color:'#c83a3a', bg:'rgba(200,58,58,0.1)',  border:'rgba(200,58,58,0.25)',  dot:'#c83a3a' },
};

export default function DetailCommande() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCommande({
        id: id || 'CMD-001',
        client: { nom:'Jean Dupont', email:'jean.dupont@email.com', telephone:'06 12 34 56 78', adresse:'12 rue des Lilas, 75001 Paris' },
        produits: [{ id:1, nom:'Tomates bio', quantite:2, prix:3.50, total:7.00, lot:'A1-2405', origine:'France, Bretagne', dateProduction:'2025-03-15' }],
        montantTotal:7.00, fraisLivraison:3.50, montantFinal:10.50,
        date:'2026-04-09T10:30:00', statut:'en_attente',
        modePaiement:'Carte bancaire', note:'Livraison entre 14h et 17h'
      });
      setLoading(false);
    }, 400);
  }, [id]);

  const update = (fn) => { setUpdating(true); setTimeout(() => { setCommande(c => fn(c)); setUpdating(false); }, 500); };

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh'}}><div style={{width:36,height:36,border:'3px solid #e8d9c4',borderTop:'3px solid #6b8f3e',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
  if (!commande) return <div style={{textAlign:'center',padding:60}}><p style={{color:'#9a8a7a'}}>Commande introuvable.</p></div>;

  const cfg = STATUT_CONFIG[commande.statut] || STATUT_CONFIG.en_attente;

  return (
    <>
      <style>{SHARED}{`
        .detail-header { display:flex; align-items:flex-start; gap:14px; flex-wrap:wrap; margin-bottom:28px; }
        .back-btn { background:none; border:1.5px solid var(--sand); border-radius:10px; padding:8px 14px; font-size:13px; font-weight:600; color:var(--soil); cursor:pointer; font-family:'Space Grotesk',sans-serif; transition:all 0.15s; white-space:nowrap; }
        .back-btn:hover { background:var(--sand); }
        .header-info { flex:1; }
        .header-top  { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
        .page-title  { font-family:'Playfair Display',serif; font-size:clamp(20px,4vw,30px); font-weight:900; color:var(--soil); }
        .page-sub    { font-size:12px; color:#9a8a7a; margin-top:4px; }

        .statut-badge { display:inline-flex; align-items:center; gap:5px; padding:5px 12px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:0.5px; border:1.5px solid; }
        .statut-dot   { width:6px; height:6px; border-radius:50%; }

        .cards { display:flex; flex-direction:column; gap:16px; }

        .card { background:#fff; border-radius:18px; border:1px solid rgba(0,0,0,0.05); overflow:hidden; }
        .card-header { padding:18px 22px; border-bottom:1px solid var(--cream); display:flex; justify-content:space-between; align-items:center; }
        .card-title  { font-size:13px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--leaf); }
        .card-body   { padding:20px 22px; }

        .info-grid { display:grid; grid-template-columns:1fr; gap:14px; }
        @media(min-width:600px){ .info-grid { grid-template-columns:1fr 1fr; } }
        .info-field label { font-size:11px; color:#9a8a7a; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; display:block; margin-bottom:4px; }
        .info-field p { font-size:14px; font-weight:600; color:var(--soil); }

        .table-wrap { overflow-x:auto; }
        table { width:100%; border-collapse:collapse; }
        thead tr { background:var(--light); }
        th { padding:10px 14px; text-align:left; font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#9a8a7a; }
        td { padding:12px 14px; font-size:13.5px; border-bottom:1px solid var(--cream); }
        td:last-child, th:last-child { text-align:right; }
        tbody tr:last-child td { border-bottom:none; }

        .total-block { margin-top:20px; padding-top:20px; border-top:1px solid var(--cream); display:flex; justify-content:flex-end; }
        .total-inner { width:240px; display:flex; flex-direction:column; gap:8px; }
        .total-row   { display:flex; justify-content:space-between; font-size:13px; }
        .total-row.final { padding-top:10px; border-top:2px solid var(--sand); font-size:17px; font-weight:700; }
        .total-row.final span:last-child { color:var(--leaf); }

        .note-block { background:var(--light); border-radius:10px; padding:14px 16px; font-size:13px; color:var(--soil); margin-top:14px; border-left:3px solid var(--amber); }

        .action-block { padding:20px 22px; background:var(--cream); border-top:1px solid var(--sand); display:flex; gap:10px; flex-wrap:wrap; }
        .act-btn { padding:10px 20px; border-radius:10px; font-size:13px; font-weight:700; border:none; cursor:pointer; font-family:'Space Grotesk',sans-serif; transition:all 0.15s; }
        .act-confirm { background:linear-gradient(135deg,var(--moss),var(--leaf)); color:#fff; box-shadow:0 3px 10px rgba(74,94,42,0.3); }
        .act-confirm:hover { box-shadow:0 5px 16px rgba(74,94,42,0.4); transform:translateY(-1px); }
        .act-reject  { background:rgba(192,60,60,0.1); color:#c03c3c; border:1.5px solid rgba(192,60,60,0.2) !important; }
        .act-ship    { background:rgba(123,58,200,0.1); color:#7b3ac8; border:1.5px solid rgba(123,58,200,0.2) !important; }
        .act-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none !important; }
      `}</style>

      <div>
        <div className="detail-header">
          <button className="back-btn" onClick={() => navigate('/producteur/commandes')}>← Retour</button>
          <div className="header-info">
            <div className="header-top">
              <h1 className="page-title">Commande {commande.id}</h1>
              <span className="statut-badge" style={{color:cfg.color,background:cfg.bg,borderColor:cfg.border}}>
                <span className="statut-dot" style={{background:cfg.dot}} />
                {cfg.label}
              </span>
            </div>
            <p className="page-sub">
              Passée le {new Date(commande.date).toLocaleDateString('fr-FR')} à {new Date(commande.date).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
            </p>
          </div>
        </div>

        <div className="cards">

          {/* Client */}
          <div className="card">
            <div className="card-header"><span className="card-title">◈ Client</span></div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-field"><label>Nom</label><p>{commande.client.nom}</p></div>
                <div className="info-field"><label>Email</label><p>{commande.client.email}</p></div>
                <div className="info-field"><label>Téléphone</label><p>{commande.client.telephone}</p></div>
                <div className="info-field" style={{gridColumn:'1/-1'}}><label>Adresse</label><p>{commande.client.adresse}</p></div>
              </div>
            </div>
          </div>

          {/* Produits */}
          <div className="card">
            <div className="card-header"><span className="card-title">⊞ Produits</span></div>
            <div className="card-body">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Lot</th>
                      <th>Qté</th>
                      <th>Prix unit.</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commande.produits.map((p, i) => (
                      <tr key={i}>
                        <td>
                          <div style={{fontWeight:700,color:'var(--soil)'}}>{p.nom}</div>
                          <div style={{fontSize:11,color:'#9a8a7a',marginTop:2}}>Origine: {p.origine}</div>
                        </td>
                        <td style={{color:'#7a6a5a'}}>{p.lot}</td>
                        <td>{p.quantite}</td>
                        <td>{p.prix.toFixed(2)} €</td>
                        <td style={{fontWeight:700}}>{p.total.toFixed(2)} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="total-block">
                <div className="total-inner">
                  <div className="total-row"><span style={{color:'#9a8a7a'}}>Sous-total</span><span>{commande.montantTotal.toFixed(2)} €</span></div>
                  <div className="total-row"><span style={{color:'#9a8a7a'}}>Livraison</span><span>{commande.fraisLivraison.toFixed(2)} €</span></div>
                  <div className="total-row final"><span>Total</span><span>{commande.montantFinal.toFixed(2)} €</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Paiement */}
          <div className="card">
            <div className="card-header"><span className="card-title">◎ Paiement & livraison</span></div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-field"><label>Mode de paiement</label><p>{commande.modePaiement}</p></div>
                <div className="info-field"><label>Statut</label>
                  <span className="statut-badge" style={{color:cfg.color,background:cfg.bg,borderColor:cfg.border,marginTop:4,display:'inline-flex'}}>
                    <span className="statut-dot" style={{background:cfg.dot}}/>{cfg.label}
                  </span>
                </div>
              </div>
              {commande.note && (
                <div className="note-block">
                  <strong style={{fontSize:11,color:'#9a6020',letterSpacing:'1px',textTransform:'uppercase'}}>Note client ·</strong> {commande.note}
                </div>
              )}
            </div>

            {/* Actions */}
            {commande.statut === 'en_attente' && (
              <div className="action-block">
                <button onClick={() => update(c => ({...c,statut:'confirmee'}))} disabled={updating} className="act-btn act-confirm">
                  {updating ? '…' : '✓ Confirmer la commande'}
                </button>
                <button onClick={() => { if(window.confirm('Rejeter ?')) update(c => ({...c,statut:'rejetee'})); }} disabled={updating} className="act-btn act-reject">
                  ✕ Rejeter
                </button>
              </div>
            )}
            {commande.statut === 'confirmee' && (
              <div className="action-block">
                <button onClick={() => update(c => ({...c,statut:'expediee'}))} disabled={updating} className="act-btn act-ship">
                  {updating ? '…' : '↑ Marquer comme expédiée'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}