import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

const money = (n) => `$${Number(n).toLocaleString()}`;

export default function Dashboard() {
  const { user } = useAuth();
  const [d, setD] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { api('/dashboard').then(setD).catch(e => setError(e.message)); }, []);

  const stats = d ? [
    ['Bukaan guud ahaan', d.patients],
    ['Ballamaha maanta', d.appointmentsToday],
    d.unpaid !== undefined && ['Lacag aan la bixin', money(d.unpaid)],
    d.paid !== undefined && ['Lacag la bixiyay', money(d.paid)],
    d.users !== undefined && ['Isticmaalayaal firfircoon', d.users],
  ].filter(Boolean) : [];

  return (
    <section>
      <header className="page-head"><h1>Salaan, {user.full_name}</h1></header>
      {error && <div className="alert">{error}</div>}
      <div className="stats">
        {stats.map(([label, value]) => (
          <div className="card stat" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

