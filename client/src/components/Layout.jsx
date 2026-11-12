import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const ROLE_LABEL = {
  super_admin: 'Super Admin',
  receptionist: 'Soo-dhaweyn',
  doctor: 'Dhakhtar',
  cashier: 'Qaybta Lacagta',
};

const LINKS = [
  { to: '/', label: 'Dashboard', roles: null },
  { to: '/patients', label: 'Bukaanka', roles: null },
  { to: '/appointments', label: 'Ballamaha', roles: null },
  { to: '/invoices', label: 'Biilasha', roles: ['super_admin', 'cashier'] },
  { to: '/users', label: 'Isticmaalayaasha', roles: ['super_admin'] },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const out = () => { logout(); nav('/login'); };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">CARTE<span>Hospital</span></div>
        <nav>
          {LINKS.filter(l => !l.roles || l.roles.includes(user.role)).map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}>{l.label}</NavLink>
          ))}
        </nav>
        <div className="me">
          <strong>{user.full_name}</strong>
          <small>{ROLE_LABEL[user.role]}</small>
          <button className="btn ghost" onClick={out}>Ka bax</button>
        </div>
      </aside>
      <main className="content"><Outlet /></main>
    </div>
  );
        }
