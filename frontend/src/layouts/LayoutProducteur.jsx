import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/producteur/dashboard',        icon: '◈', label: 'Dashboard'  },
  { to: '/producteur/produits',         icon: '⊞', label: 'Produits'   },
  { to: '/producteur/commandes',        icon: '◎', label: 'Commandes'  },
  { to: '/producteur/produits/ajouter', icon: '⊕', label: 'Ajouter'   },
  { to: '/producteur/produits/modifier/1', icon: '⊘', label: 'Modifier'  },
  { to: '/producteur/commandes/CMD-001',   icon: '◉', label: 'Détail'    },
];

const PRIMARY_TABS = navItems.slice(0, 4);
const MORE_ITEMS   = navItems.slice(4);

export default function LayoutProducteur() {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');

        :root {
          --soil:   #1a1208;
          --bark:   #2c1f0e;
          --humus:  #3d2b14;
          --moss:   #4a5e2a;
          --leaf:   #6b8f3e;
          --sage:   #8fb85a;
          --cream:  #f5efe6;
          --sand:   #e8d9c4;
          --amber:  #c8873a;
          --gold:   #e8a84a;
          --light:  #fdfaf6;
        }

        * { box-sizing: border-box; }

        body {
          font-family: 'Space Grotesk', sans-serif;
          background: var(--light);
          color: var(--soil);
        }

        .layout-root {
          display: flex;
          min-height: 100vh;
          background: var(--light);
        }

        /* ── SIDEBAR ───────────────────────────────── */
        .sidebar {
          display: none;
          width: 260px;
          flex-direction: column;
          background: var(--soil);
          position: fixed;
          top: 0; left: 0;
          height: 100%;
          z-index: 30;
          padding: 0;
          overflow: hidden;
        }
        @media (min-width: 768px) { .sidebar { display: flex; } }

        .sidebar-brand {
          padding: 28px 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .sidebar-logo {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 900;
          color: var(--sage);
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .sidebar-logo span.dot {
          width: 8px; height: 8px;
          background: var(--amber);
          border-radius: 50%;
          display: inline-block;
        }
        .sidebar-sub {
          font-size: 10px;
          font-weight: 500;
          color: rgba(255,255,255,0.3);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sidebar-section-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          padding: 8px 12px 4px;
          margin-top: 8px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          transition: all 0.2s ease;
          position: relative;
          letter-spacing: 0.2px;
        }
        .nav-link:hover {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.85);
        }
        .nav-link.active {
          background: linear-gradient(135deg, var(--moss), var(--leaf));
          color: #fff;
          box-shadow: 0 4px 12px rgba(74,94,42,0.4);
        }
        .nav-link .nav-icon {
          font-size: 18px;
          width: 22px;
          text-align: center;
          line-height: 1;
        }
        .nav-link .nav-pip {
          position: absolute;
          right: 14px;
          width: 6px; height: 6px;
          background: var(--amber);
          border-radius: 50%;
        }

        .sidebar-footer {
          padding: 16px 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .user-avatar {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, var(--moss), var(--amber));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
        }
        .user-info p { margin: 0; }
        .user-name { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.8); }
        .user-role { font-size: 10px; color: rgba(255,255,255,0.3); letter-spacing: 0.5px; }

        /* ── MAIN ─────────────────────────────────── */
        .main-content {
          flex: 1;
          min-height: 100vh;
          padding: 24px;
          padding-bottom: 96px;
        }
        @media (min-width: 768px) {
          .main-content {
            margin-left: 260px;
            padding: 32px 36px;
            padding-bottom: 32px;
          }
        }

        /* Mobile topbar */
        .mobile-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        @media (min-width: 768px) { .mobile-topbar { display: none; } }
        .mobile-logo {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 900;
          color: var(--bark);
        }
        .mobile-logo em { color: var(--leaf); font-style: normal; }

        /* ── MOBILE BOTTOM NAV ────────────────────── */
        .bottom-nav {
          display: flex;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 40;
          background: var(--soil);
          border-top: 1px solid rgba(255,255,255,0.08);
          height: 68px;
          align-items: stretch;
          padding: 0 4px;
        }
        @media (min-width: 768px) { .bottom-nav { display: none; } }

        .bottom-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          flex: 1;
          text-decoration: none;
          border: none;
          background: none;
          cursor: pointer;
          padding: 8px 4px;
          transition: all 0.2s ease;
          position: relative;
          color: rgba(255,255,255,0.35);
        }
        .bottom-tab:hover { color: rgba(255,255,255,0.7); }
        .bottom-tab.active { color: var(--sage); }
        .bottom-tab.active::before {
          content: '';
          position: absolute;
          top: 0; left: 20%; right: 20%;
          height: 2px;
          background: var(--sage);
          border-radius: 0 0 4px 4px;
        }
        .bottom-tab-icon { font-size: 20px; line-height: 1; }
        .bottom-tab-label { font-size: 9px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }

        /* ── MORE SHEET ───────────────────────────── */
        .sheet-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 48;
          backdrop-filter: blur(3px);
        }
        .sheet {
          position: fixed;
          left: 0; right: 0;
          z-index: 49;
          background: var(--bark);
          border-radius: 20px 20px 0 0;
          transition: bottom 0.35s cubic-bezier(0.32, 0.72, 0, 1);
          padding-bottom: 76px;
        }
        .sheet-handle {
          display: flex;
          justify-content: center;
          padding: 12px 0 8px;
        }
        .sheet-handle span {
          width: 36px; height: 4px;
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
          display: block;
        }
        .sheet-title {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          padding: 0 20px 12px;
        }
        .sheet-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 20px;
          text-decoration: none;
          color: rgba(255,255,255,0.75);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.15s ease;
          margin: 0 12px;
          border-radius: 12px;
        }
        .sheet-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .sheet-item.active { background: rgba(107,143,62,0.25); color: var(--sage); }
        .sheet-item-icon { font-size: 24px; width: 28px; text-align: center; }
        .sheet-arrow { margin-left: auto; opacity: 0.3; font-size: 16px; }
      `}</style>

      <div className="layout-root">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <Link to="/producteur/dashboard" className="sidebar-logo">
              <span className="dot" />
              AGRO<span style={{color:'var(--amber)'}}>MARKET</span>
            </Link>
            <p className="sidebar-sub">Espace Producteur</p>
          </div>

          <nav className="sidebar-nav">
            <p className="sidebar-section-label">Navigation</p>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-link ${isActive(item.to) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.label === 'Commandes' && <span className="nav-pip" />}
              </Link>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="user-avatar">P</div>
              <div className="user-info">
                <p className="user-name">Producteur</p>
                <p className="user-role">code33457@gmail.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main-content">
          <div className="mobile-topbar">
            <span className="mobile-logo">AGRO<em>MARKET</em></span>
          </div>
          <Outlet />
        </main>

        {/* ── BOTTOM NAV ── */}
        <nav className="bottom-nav">
          {PRIMARY_TABS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMoreOpen(false)}
              className={`bottom-tab ${isActive(item.to) ? 'active' : ''}`}
            >
              <span className="bottom-tab-icon">{item.icon}</span>
              <span className="bottom-tab-label">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => setMoreOpen(v => !v)}
            className={`bottom-tab ${moreOpen ? 'active' : ''}`}
          >
            <span className="bottom-tab-icon">{moreOpen ? '✕' : '≡'}</span>
            <span className="bottom-tab-label">Plus</span>
          </button>
        </nav>

        {/* ── SHEET ── */}
        {moreOpen && <div className="sheet-backdrop" onClick={() => setMoreOpen(false)} />}
        <div className="sheet" style={{ bottom: moreOpen ? 0 : '-240px' }}>
          <div className="sheet-handle"><span /></div>
          <p className="sheet-title">Plus d'options</p>
          {MORE_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMoreOpen(false)}
              className={`sheet-item ${isActive(item.to) ? 'active' : ''}`}
            >
              <span className="sheet-item-icon">{item.icon}</span>
              {item.label}
              <span className="sheet-arrow">›</span>
            </Link>
          ))}
        </div>

      </div>
    </>
  );
}