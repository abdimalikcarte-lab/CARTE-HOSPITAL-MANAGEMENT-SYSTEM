import Crud from '../components/Crud.jsx';
import { useAuth } from '../AuthContext.jsx';

export default function Patients() {
  const { user } = useAuth();
  const canCreate = ['super_admin', 'receptionist', 'doctor'].includes(user.role);
  return (
    <Crud
      title="Bukaanka"
      endpoint="/patients"
      searchable
      canCreate={canCreate}
      createLabel="Bukaan cusub"
      columns={[
        { key: 'full_name', label: 'Magaca' },
        { key: 'gender', label: 'Jinsiga' },
        { key: 'phone', label: 'Taleefan' },
        { key: 'dob', label: 'Dhalashada', render: r => r.dob ? r.dob.slice(0, 10) : '-' },
        { key: 'address', label: 'Cinwaan' },
      ]}
      fields={[
        { name: 'full_name', label: 'Magaca oo buuxa', required: true },
        { name: 'gender', label: 'Jinsiga', type: 'select', required: true,
          options: [{ value: 'Lab', label: 'Lab' }, { value: 'Dhedig', label: 'Dhedig' }] },
        { name: 'phone', label: 'Taleefan' },
        { name: 'dob', label: 'Taariikhda dhalashada', type: 'date' },
        { name: 'address', label: 'Cinwaan' },
      ]}
      rowActions={(r, act) => user.role === 'super_admin' && (
        <button className="btn danger sm" onClick={() => act(`/patients/${r.id}`, 'DELETE')}>Tirtir</button>
      )}
    />
  );
}

