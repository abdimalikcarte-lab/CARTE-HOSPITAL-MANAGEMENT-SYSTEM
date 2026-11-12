import Crud from '../components/Crud.jsx';
import { useAuth } from '../AuthContext.jsx';

const STATUS = { scheduled: 'La qorsheeyay', completed: 'La dhammeeyay', cancelled: 'La joojiyay' };

export default function Appointments() {
  const { user } = useAuth();
  const canCreate = ['super_admin', 'receptionist'].includes(user.role);
  return (
    <Crud
      title="Ballamaha"
      endpoint="/appointments"
      canCreate={canCreate}
      createLabel="Ballan cusub"
      columns={[
        { key: 'patient_name', label: 'Bukaan' },
        { key: 'doctor_name', label: 'Dhakhtar' },
        { key: 'scheduled_at', label: 'Waqtiga', render: r => new Date(r.scheduled_at).toLocaleString() },
        { key: 'reason', label: 'Sababta' },
        { key: 'status', label: 'Xaalad', render: r => <span className={`tag ${r.status}`}>{STATUS[r.status]}</span> },
      ]}
      fields={[
        { name: 'patient_id', label: 'Bukaan', optionsFrom: '/patients', required: true },
        { name: 'doctor_id', label: 'Dhakhtar', optionsFrom: '/users/doctors', required: true },
        { name: 'scheduled_at', label: 'Waqtiga', type: 'datetime-local', required: true },
        { name: 'reason', label: 'Sababta' },
      ]}
      rowActions={(r, act) => (
        <>
          {r.status === 'scheduled' && (
            <>
              <button className="btn sm" onClick={() => act(`/appointments/${r.id}/status`, 'PATCH', { status: 'completed' })}>Dhammee</button>
              <button className="btn ghost sm" onClick={() => act(`/appointments/${r.id}/status`, 'PATCH', { status: 'cancelled' })}>Jooji</button>
            </>
          )}
          {user.role === 'super_admin' && (
            <button className="btn danger sm" onClick={() => act(`/appointments/${r.id}`, 'DELETE')}>Tirtir</button>
          )}
        </>
      )}
    />
  );
}

