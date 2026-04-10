import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
  :root {
    --soil:#1a1208;--bark:#2c1f0e;--humus:#3d2b14;
    --moss:#4a5e2a;--leaf:#6b8f3e;--sage:#8fb85a;
    --cream:#f5efe6;--sand:#e8d9c4;--amber:#c8873a;
    --gold:#e8a84a;--light:#fdfaf6;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Space Grotesk',sans-serif;background:var(--light);color:var(--soil);}
`;

export default function DashboardProducteur() {
  const [stats, setStats] = useState({ clients: 0, commandes: 0, revenus: 0, produits: 0 });
  const [ventes, setVentes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setStats({ clients: 24, commandes: 47, revenus: 1284.50, produits: 12 });
      setVentes([
        { mois: 'Jan', v: 42 }, { mois: 'Fév', v: 61 }, { mois: 'Mar', v: 78 },
        { mois: 'Avr', v: 95 }, { mois: 'Mai', v: 112 }, { mois: 'Jun', v: 134 },
        { mois: 'Jul', v: 119 }, { mois: 'Aoû', v: 98 }, { mois: 'Sep', v: 83 },
        { mois: 'Oct', v: 67 }, { mois: 'Nov', v: 54 }, { mois: 'Déc', v: 38 },
      ]);
      setLoaded(true);
      setTimeout(() => setAnimated(true), 100);
    }, 400);
  }, []);

  const max = Math.max(...ventes.map(v => v.v), 1);

  const statCards = [
    { label: 'Clients', value: stats.clients, suffix: '', color: '#6b8f3e', bg: 'rgba(107,143,62,0.08)', icon: '◈' },
    { label: 'Commandes', value: stats.commandes, suffix: '', color: '#c8873a', bg: 'rgba(200,135,58,0.08)', icon: '◎' },
    { label: 'Revenus', value: stats.revenus, suffix: ' €', color: '#1a1208', bg: 'rgba(26,18,8,0.06)', icon: '◆' },
    { label: 'Produits', value: stats.produits, suffix: '', color: '#8fb85a', bg: 'rgba(143,184,90,0.1)', icon: '⊞' },
  ];

  if (!loaded) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', flexDirection:'column', gap:12 }}>
      <div style={{ width:40, height:40, border:'3px solid #e8d9c4', borderTop:'3px solid #6b8f3e', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
      <p style={{ fontSize:13, color:'#9a8a7a', fontFamily:"'Space Grotesk',sans-serif" }}>Chargement...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <style>{sharedStyles}{`
        .dash-header { margin-bottom: 32px; }
        .dash-greeting {
          font-family: 'Playfair Display', serif;
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 900;
          color: var(--soil);
          line-height: 1.1;
        }
        .dash-greeting em { color: var(--leaf); font-style: normal; }
        .dash-sub { font-size: 13px; color: #9a8a7a; margin-top: 6px; }
        .dash-confirm {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
          background: rgba(200,135,58,0.1);
          border: 1px solid rgba(200,135,58,0.25);
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 12px;
          color: var(--amber);
        }
        .dash-confirm button {
          background: none; border: none; cursor: pointer;
          font-size: 12px; color: var(--amber);
          text-decoration: underline; padding: 0;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
        }

        /* stat cards */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 32px;
        }
        @media(min-width:900px){ .stat-grid { grid-template-columns: repeat(4,1fr); } }

        .stat-card {
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(0,0,0,0.06);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: default;
        }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .stat-icon {
          font-size: 22px;
          margin-bottom: 14px;
          display: block;
        }
        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 900;
          line-height: 1;
        }
        .stat-label { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 6px; opacity: 0.6; }

        /* chart */
        .chart-card {
          background: var(--soil);
          border-radius: 20px;
          padding: 28px;
          color: #fff;
        }
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
        }
        .chart-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }
        .chart-year {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          margin-top: 3px;
        }
        .chart-total {
          text-align: right;
        }
        .chart-total-val {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 900;
          color: var(--sage);
        }
        .chart-total-label { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 2px; }

        .bars {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 120px;
        }
        .bar-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          height: 100%;
          justify-content: flex-end;
        }
        .bar {
          width: 100%;
          border-radius: 6px 6px 0 0;
          transition: height 1s cubic-bezier(0.34,1.56,0.64,1);
          min-height: 4px;
          background: linear-gradient(to top, var(--moss), var(--sage));
        }
        .bar:hover { background: linear-gradient(to top, var(--amber), var(--gold)); }
        .bar-label { font-size: 9px; color: rgba(255,255,255,0.3); letter-spacing: 0.5px; }

        /* quick actions */
        .actions-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 20px;
        }
        .action-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s ease;
          border: 1.5px solid;
        }
        .action-btn.primary {
          background: linear-gradient(135deg, var(--moss), var(--leaf));
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(74,94,42,0.3);
        }
        .action-btn.primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(74,94,42,0.4); }
        .action-btn.secondary {
          background: transparent;
          color: var(--soil);
          border-color: var(--sand);
        }
        .action-btn.secondary:hover { background: var(--sand); }
      `}</style>

      <div>
        {/* Header */}
        <div className="dash-header">
          <h1 className="dash-greeting">Bonjour, <em>Producteur</em> 👋</h1>
          <p className="dash-sub">Voici un aperçu de votre activité aujourd'hui.</p>
          <div className="dash-confirm">
            ⚠ Confirmez votre email · code33457@gmail.com
            <button>Renvoyer</button>
          </div>
        </div>

        {/* Stats */}
        <div className="stat-grid">
          {statCards.map((s, i) => (
            <div
              key={i}
              className="stat-card"
              style={{ background: s.bg }}
            >
              <span className="stat-icon" style={{ color: s.color }}>{s.icon}</span>
              <div className="stat-value" style={{ color: s.color }}>
                {s.suffix === ' €' ? s.value.toFixed(2) : s.value}{s.suffix}
              </div>
              <div className="stat-label" style={{ color: s.color }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Ventes mensuelles</div>
              <div className="chart-year">2026</div>
            </div>
            <div className="chart-total">
              <div className="chart-total-val">
                {ventes.reduce((a, v) => a + v.v, 0)}
              </div>
              <div className="chart-total-label">unités vendues</div>
            </div>
          </div>
          <div className="bars">
            {ventes.map((v, i) => (
              <div className="bar-wrap" key={i}>
                <div
                  className="bar"
                  style={{ height: animated ? `${(v.v / max) * 100}%` : '0%' }}
                  title={`${v.mois}: ${v.v}`}
                />
                <span className="bar-label">{v.mois}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="actions-row">
          <Link to="/producteur/produits/ajouter" className="action-btn primary">
            ⊕ Ajouter un produit
          </Link>
          <Link to="/producteur/commandes" className="action-btn secondary">
            ◎ Voir les commandes
          </Link>
        </div>
      </div>
    </>
  );
}