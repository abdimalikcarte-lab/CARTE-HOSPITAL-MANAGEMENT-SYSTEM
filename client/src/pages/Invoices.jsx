import Crud from '../components/Crud.jsx';
import { useAuth } from '../AuthContext.jsx';

export default function Invoices() {
  const { user } = useAuth();
  return (
    <Crud
      title="Biilasha"
      endpoint="/invoices"
      canCreate
      createLabel="Biil cusub"
      columns={[
        { key: 'patient_name', label: 'Bukaan' },
        { key: 'description', label: 'Faahfaahin' },
        { key: 'amount', label: 'Qadarka', render: r => `$${Number(r.amount).toLocaleString()}` },
        { key: 'status', label: 'Xaalad', render: r => (
          <span className={`tag ${r.status}`}>{r.status === 'paid' ? 'La bixiyay' : 'Lama bixin'}</span>) },
        { key: 'created_at', label: 'Taariikh', render: r => r.created_at.slice(0, 10) },
      ]}
      fields={[
        { name: 'patient_id', label: 'Bukaan', optionsFrom: '/patients', required: true },
        { name: 'description', label: 'Faahfaahin', required: true },
        { name: 'amount', label: 'Qadarka ($)', type: 'number', required: true },
      ]}
      rowActions={(r, act) => (
        <>
          {r.status === 'unpaid' && (
            <button className="btn sm" onClick={() => act(`/invoices/${r.id}/pay`)}>Bixi</button>
          )}
          {user.role === 'super_admin' && (
            <button className="btn danger sm" onClick={() => act(`/invoices/${r.id}`, 'DELETE')}>Tirtir</button>
          )}
        </>
      )}
    />
  );
}

