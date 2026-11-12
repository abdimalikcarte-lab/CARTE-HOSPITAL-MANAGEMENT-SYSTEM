import { useEffect, useState } from 'react';
import { api } from '../api.js';

// Qayb dib loo isticmaali karo: liiska + foomka ku darista
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

