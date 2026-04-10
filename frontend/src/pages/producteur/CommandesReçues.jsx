import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SHARED = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
  :root{--soil:#1a1208;--bark:#2c1f0e;--moss:#4a5e2a;--leaf:#6b8f3e;--sage:#8fb85a;--cream:#f5efe6;--sand:#e8d9c4;--amber:#c8873a;--light:#fdfaf6;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Space Grotesk',sans-serif;}
`;

const MOCK = [
  { id:'CMD-001', client:'Jean Dupont', email:'jean.dupont@email.com', telephone:'06 12 34 56 78', produits:[{nom:'Tomates bio',quantite:2,prix:3.50,lot:'A1-2405'}], montantTotal:7.00, date:'2026-04-09T10:30:00', statut:'en_attente', adresseLivraison:'12 rue des Lilas, 75001 Paris' },
  { id:'CMD-002', client:'Marie Curie', email:'marie.curie@email.com', telephone:'06 98 76 54 32', produits:[{nom:'Courgettes',quantite:3,prix:2.80,lot:'B2-2406'}], montantTotal:8.40, date:'2026-04-08T14:15:00', statut:'confirmee', adresseLivraison:'5 avenue des Roses, 69002 Lyon' },
  { id:'CMD-003', client:'Pierre Martin', email:'pierre.martin@email.com', telephone:'07 11 22 33 44', produits:[{nom:'Miel de printemps',quantite:2,prix:12.00,lot:'C3-2407'},{nom:'Tomates bio',quantite:1,prix:3.50,lot:'A1-2405'}], montantTotal:27.50, date:'2026-04-07T09:45:00', statut:'expediee', adresseLivraison:'8 rue de la Gare, 44000 Nantes' },
  { id:'CMD-004', client:'Sophie Dubois', email:'sophie.dubois@email.com', telephone:'06 55 66 77 88', produits:[{nom:'Courgettes',quantite:1,prix:2.80,lot:'B2-2406'}], montantTotal:2.80, date:'2026-04-06T16:20:00', statut:'livree', adresseLivraison:'15 boulevard Victor Hugo, 13001 Marseille' },
];

const STATUT_CONFIG = {
  en_attente: { label:'En attente', color:'#c8873a', bg:'rgba(200,135,58,0.1)', border:'rgba(200,135,58,0.25)', dot:'#c8873a' },
  confirmee:  { label:'Confirmée',  color:'#3a7bc8', bg:'rgba(58,123,200,0.1)', border:'rgba(58,123,200,0.25)', dot:'#3a7bc8' },
  expediee:   { label:'Expédiée',   color:'#7b3ac8', bg:'rgba(123,58,200,0.1)', border:'rgba(123,58,200,0.25)', dot:'#7b3ac8' },
  livree:     { label:'Livrée',     color:'#3a8f4a', bg:'rgba(58,143,74,0.1)',  border:'rgba(58,143,74,0.25)',  dot:'#3a8f4a' },
  rejetee:    { label:'Rejetée',    color:'#c83a3a', bg:'rgba(200,58,58,0.1)',  border:'rgba(200,58,58,0.25)',  dot:'#c83a3a' },
};

export default function CommandesRecues() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('toutes');
  const [search, setSearch]     = useState('');

  useEffect(() => { setTimeout(() => { setCommandes(MOCK); setLoading(false); }, 400); }, []);

  const handleConfirmer = (id) => setCommandes(c => c.map(x => x.id===id ? {...x,statut:'confirmee'} : x));
  const handleRejeter   = (id) => { if(window.confirm('Rejeter cette commande ?')) setCommandes(c => c.map(x => x.id===id ? {...x,statut:'rejetee'} : x)); };
  const handleExpedier  = (id) => setCommandes(c => c.map(x => x.id===id ? {...x,statut:'expediee'} : x));

  const filtered = commandes.filter(c => {
    if (filter !== 'toutes' && c.statut !== filter) return false;
    if (search && !c.id.toLowerCase().includes(search.toLowerCase()) && !c.client.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total:       commandes.length,
    en_attente:  commandes.filter(c => c.statut === 'en_attente').length,
    a_expedier:  commandes.filter(c => c.statut === 'confirmee').length,
    revenus:     commandes.reduce((s, c) => s + c.montantTotal, 0),
  };

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh'}}><div style={{width:36,height:36,border:'3px solid #e8d9c4',borderTop:'3px solid #6b8f3e',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  const FILTERS = ['toutes','en_attente','confirmee','expediee','livree'];

  return (
    <>
      <style>{SHARED}{`
        .page-title { font-family:'Playfair Display',serif; font-size:clamp(22px,4vw,32px); font-weight:900; color:var(--soil); }
        .page-sub   { font-size:13px; color:#9a8a7a; margin-top:5px; margin-bottom:24px; }

        .stat-row { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:24px; }
        @media(min-width:900px){ .stat-row { grid-template-columns:repeat(4,1fr); } }

        .stat-chip {
          background:#fff;
          border-radius:14px;
          padding:16px;
          border:1px solid rgba(0,0,0,0.05);
          display:flex;
          flex-direction:column;
          gap:4px;
        }
        .stat-chip-val  { font-family:'Playfair Display',serif; font-size:26px; font-weight:900; color:var(--soil); }
        .stat-chip-key  { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#9a8a7a; }

        .toolbar {
          background:#fff;
          border-radius:14px;
          padding:16px 20px;
          margin-bottom:20px;
          border:1px solid rgba(0,0,0,0.05);
          display:flex;
          flex-direction:column;
          gap:12px;
        }
        @media(min-width:640px){ .toolbar { flex-direction:row; align-items:center; justify-content:space-between; } }

        .filter-pills { display:flex; gap:6px; flex-wrap:wrap; }
        .pill {
          padding:6px 14px;
          border-radius:20px;
          font-size:12px;
          font-weight:600;
          border:1.5px solid;
          cursor:pointer;
          transition:all 0.15s;
          background:none;
          font-family:'Space Grotesk',sans-serif;
        }
        .pill.active-all    { background:var(--soil); color:#fff; border-color:var(--soil); }
        .pill.inactive-all  { color:#9a8a7a; border-color:var(--sand); }
        .pill.inactive-all:hover { background:var(--sand); }

        .search-wrap { position:relative; }
        .search-wrap input { border:1.5px solid var(--sand); border-radius:10px; padding:9px 14px 9px 36px; font-size:13px; font-family:'Space Grotesk',sans-serif; outline:none; width:100%; transition:border-color 0.2s; }
        .search-wrap input:focus { border-color:var(--leaf); }
        .search-wrap .ico { position:absolute; left:12px; top:50%; transform:translateY(-50%); font-size:14px; color:#9a8a7a; }

        .orders-list { display:flex; flex-direction:column; gap:14px; }

        .order-card {
          background:#fff;
          border-radius:16px;
          border:1px solid rgba(0,0,0,0.05);
          overflow:hidden;
          transition:box-shadow 0.2s;
        }
        .order-card:hover { box-shadow:0 8px 24px rgba(0,0,0,0.08); }

        .order-top {
          padding:16px 20px;
          display:flex;
          flex-wrap:wrap;
          justify-content:space-between;
          align-items:flex-start;
          gap:10px;
          border-bottom:1px solid var(--cream);
        }
        .order-id {
          font-family:'Playfair Display',serif;
          font-size:17px;
          font-weight:700;
          color:var(--soil);
          text-decoration:none;
        }
        .order-id:hover { color:var(--leaf); }
        .order-date { font-size:11px; color:#9a8a7a; margin-top:2px; }

        .statut-badge {
          display:inline-flex;
          align-items:center;
          gap:5px;
          padding:5px 12px;
          border-radius:20px;
          font-size:11px;
          font-weight:700;
          letter-spacing:0.5px;
          border:1.5px solid;
        }
        .statut-dot { width:6px; height:6px; border-radius:50%; }

        .order-amount {
          font-family:'Playfair Display',serif;
          font-size:20px;
          font-weight:900;
          color:var(--soil);
        }

        .order-body { padding:16px 20px; display:flex; flex-direction:column; gap:12px; }

        .client-block {
          background:var(--light);
          border-radius:10px;
          padding:12px 16px;
          display:flex;
          flex-wrap:wrap;
          gap:16px;
          font-size:12.5px;
        }
        .client-field strong { color:var(--soil); font-weight:700; }
        .client-field span   { color:#7a6a5a; }

        .produits-list { display:flex; flex-wrap:wrap; gap:6px; }
        .produit-tag {
          background:var(--cream);
          border-radius:8px;
          padding:5px 10px;
          font-size:11.5px;
          font-weight:600;
          color:var(--bark);
        }

        .order-actions {
          padding:14px 20px;
          background:var(--light);
          border-top:1px solid var(--cream);
          display:flex;
          flex-wrap:wrap;
          gap:8px;
          align-items:center;
        }

        .act-btn {
          padding:8px 16px;
          border-radius:9px;
          font-size:12px;
          font-weight:700;
          border:none;
          cursor:pointer;
          font-family:'Space Grotesk',sans-serif;
          transition:all 0.15s;
          text-decoration:none;
          display:inline-block;
        }
        .act-confirm { background:linear-gradient(135deg,var(--moss),var(--leaf)); color:#fff; box-shadow:0 2px 8px rgba(74,94,42,0.25); }
        .act-confirm:hover { box-shadow:0 4px 12px rgba(74,94,42,0.35); }
        .act-reject  { background:rgba(192,60,60,0.1); color:#c03c3c; border:1.5px solid rgba(192,60,60,0.2) !important; }
        .act-reject:hover { background:rgba(192,60,60,0.18); }
        .act-ship    { background:rgba(123,58,200,0.1); color:#7b3ac8; border:1.5px solid rgba(123,58,200,0.2) !important; }
        .act-ship:hover { background:rgba(123,58,200,0.18); }
        .act-detail  { background:transparent; color:#7a6a5a; border:1.5px solid var(--sand) !important; }
        .act-detail:hover { background:var(--sand); color:var(--soil); }

        .empty-state { text-align:center; padding:60px 24px; background:#fff; border-radius:16px; border:2px dashed var(--sand); }
      `}</style>

      <div>
        <h1 className="page-title">Commandes reçues</h1>
        <p className="page-sub">Gérez les commandes de vos clients</p>

        {/* Stats */}
        <div className="stat-row">
          <div className="stat-chip"><div className="stat-chip-val">{stats.total}</div><div className="stat-chip-key">Total</div></div>
          <div className="stat-chip"><div className="stat-chip-val" style={{color:'var(--amber)'}}>{stats.en_attente}</div><div className="stat-chip-key">En attente</div></div>
          <div className="stat-chip"><div className="stat-chip-val" style={{color:'#7b3ac8'}}>{stats.a_expedier}</div><div className="stat-chip-key">À expédier</div></div>
          <div className="stat-chip"><div className="stat-chip-val" style={{color:'var(--leaf)'}}>{stats.revenus.toFixed(2)} €</div><div className="stat-chip-key">Revenus</div></div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="filter-pills">
            {FILTERS.map(f => {
              const cfg = f === 'toutes' ? null : STATUT_CONFIG[f];
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="pill"
                  style={isActive
                    ? { background: f==='toutes' ? 'var(--soil)' : cfg.dot, color:'#fff', borderColor: f==='toutes' ? 'var(--soil)' : cfg.dot }
                    : { color:'#9a8a7a', borderColor:'var(--sand)' }
                  }
                >
                  {f === 'toutes' ? 'Toutes' : STATUT_CONFIG[f].label}
                </button>
              );
            })}
          </div>
          <div className="search-wrap">
            <span className="ico">🔍</span>
            <input placeholder="Rechercher…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="empty-state"><p style={{fontSize:40}}>📭</p><p style={{marginTop:12,color:'#9a8a7a'}}>Aucune commande trouvée.</p></div>
        ) : (
          <div className="orders-list">
            {filtered.map(cmd => {
              const cfg = STATUT_CONFIG[cmd.statut] || STATUT_CONFIG.en_attente;
              return (
                <div key={cmd.id} className="order-card">
                  <div className="order-top">
                    <div>
                      <Link to={`/producteur/commandes/${cmd.id}`} className="order-id">{cmd.id}</Link>
                      <div className="order-date">
                        {new Date(cmd.date).toLocaleDateString('fr-FR')} · {new Date(cmd.date).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                      <span className="statut-badge" style={{color:cfg.color,background:cfg.bg,borderColor:cfg.border}}>
                        <span className="statut-dot" style={{background:cfg.dot}} />
                        {cfg.label}
                      </span>
                      <span className="order-amount">{cmd.montantTotal.toFixed(2)} €</span>
                    </div>
                  </div>

                  <div className="order-body">
                    <div className="client-block">
                      <div className="client-field"><strong>{cmd.client}</strong></div>
                      <div className="client-field"><span>{cmd.email}</span></div>
                      <div className="client-field"><span>{cmd.telephone}</span></div>
                    </div>
                    <div className="produits-list">
                      {cmd.produits.map((p, i) => (
                        <span key={i} className="produit-tag">{p.quantite}× {p.nom} · lot {p.lot}</span>
                      ))}
                    </div>
                  </div>

                  <div className="order-actions">
                    {cmd.statut === 'en_attente' && <>
                      <button onClick={() => handleConfirmer(cmd.id)} className="act-btn act-confirm">✓ Confirmer</button>
                      <button onClick={() => handleRejeter(cmd.id)}   className="act-btn act-reject">✕ Rejeter</button>
                    </>}
                    {cmd.statut === 'confirmee' &&
                      <button onClick={() => handleExpedier(cmd.id)} className="act-btn act-ship">↑ Expédier</button>
                    }
                    <Link to={`/producteur/commandes/${cmd.id}`} className="act-btn act-detail" style={{marginLeft:'auto'}}>Détail →</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}