import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try { await login(username, password); nav('/'); }
    catch (err) { setError(err.message); }
    setBusy(false);
  };

  return (
    <div className="login">
      <div className="login-side">
        <h1>CARTE<br />Hospital</h1>
        <p>Maamulka bukaanka, ballamaha iyo lacagaha meel keliya.</p>
      </div>
      <form className="login-form" onSubmit={submit}>
        <h2>Soo gal</h2>
        {error && <div className="alert">{error}</div>}
        <label>Username
          <input className="input" value={username} onChange={e => setUsername(e.target.value)} autoFocus required />
        </label>
        <label>Password
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <button className="btn" disabled={busy}>{busy ? 'Waa la hubinayaa...' : 'Soo gal'}</button>
      </form>
    </div>
  );
}

