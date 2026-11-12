import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Crud({
  title, endpoint, columns, fields = [], canCreate = false,
  rowActions = () => null, searchable = false, createLabel = 'Ku dar',
}) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({});
  const [options, setOptions] = useState({});
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const qs = searchable && search ? `?search=${encodeURIComponent(search)}` : '';
      setRows(await api(endpoint + qs));
      setError('');
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [search]);

  useEffect(() => {
    fields.filter(f => f.optionsFrom).forEach(async f => {
      const list = await api(f.optionsFrom);
      setOptions(o => ({ ...o, [f.name]: list.map(x => ({ value: x.id, label: x.full_name })) }));
    });
    // eslint-disable-next-line
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api(endpoint, { method: 'POST', body: form });
      setForm({}); setOpen(false); load();
    } catch (err) { setError(err.message); }
  };

  const act = async (path, method = 'PATCH', body) => {
    if (method === 'DELETE' && !confirm('Ma hubtaa inaad tirtirto?')) return;
    try { await api(path, { method, body }); load(); } catch (err) { setError(err.message); }
  };

  return (
    <section>
      <header className="page-head">
        <h1>{title}</h1>
        <div className="tools">
          {searchable && (
            <input className="input" placeholder="Raadi magac ama taleefan"
              value={search} onChange={e => setSearch(e.target.value)} />
          )}
          {canCreate && (
            <button className="btn" onClick={() => setOpen(o => !o)}>{open ? 'Xidh' : createLabel}</button>
          )}
        </div>
      </header>

      {error && <div className="alert">{error}</div>}

      {open && (
        <form className="card form-grid" onSubmit={submit}>
          {fields.map(f => (
            <label key={f.name}>
              {f.label}
              {f.type === 'select' || f.optionsFrom ? (
                <select className="input" required={f.required} value={form[f.name] || ''}
                  onChange={e => setForm({ ...form, [f.name]: e.target.value })}>
                  <option value="">Dooro</option>
                  {(f.options || options[f.name] || []).map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : (
                <input className="input" type={f.type || 'text'} required={f.required}
                  value={form[f.name] || ''}
                  onChange={e => setForm({ ...form, [f.name]: e.target.value })} />
              )}
            </label>
          ))}
          <div className="form-actions"><button className="btn" type="submit">Kaydi</button></div>
        </form>
      )}

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map(c => <th key={c.key}>{c.label}</th>)}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                {columns.map(c => <td key={c.key}>{c.render ? c.render(r) : r[c.key] ?? '-'}</td>)}
                <td className="actions">{rowActions(r, act)}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="empty">Weli wax xog ah lama gelin.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
