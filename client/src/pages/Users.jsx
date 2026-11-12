import Crud from '../components/Crud.jsx';

const ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'receptionist', label: 'Soo-dhaweyn' },
  { value: 'doctor', label: 'Dhakhtar' },
  { value: 'cashier', label: 'Qaybta Lacagta' },
];

export default function Users() {
  return (
    <Crud
      title="Isticmaalayaasha"
      endpoint="/users"
      canCreate
      createLabel="Akoon cusub"
      columns={[
        { key: 'full_name', label: 'Magaca' },
        { key: 'username', label: 'Username' },
        { key: 'role', label: 'Door', render: r => ROLES.find(x => x.value === r.role)?.label },
        { key: 'active', label: 'Xaalad', render: r => (
          <span className={`tag ${r.active ? 'paid' : 'cancelled'}`}>{r.active ? 'Firfircoon' : 'La xiray'}</span>) },
      ]}
      fields={[
        { name: 'full_name', label: 'Magaca oo buuxa', required: true },
        { name: 'username', label: 'Username', required: true },
        { name: 'password', label: 'Password (ugu yaraan 6)', type: 'password', required: true },
        { name: 'role', label: 'Door', type: 'select', required: true, options: ROLES },
      ]}
      rowActions={(r, act) => (
        <>
          <button className="btn ghost sm" onClick={() => act(`/users/${r.id}/toggle`)}>
            {r.active ? 'Xidh' : 'Fur'}
          </button>
          <button className="btn danger sm" onClick={() => act(`/users/${r.id}`, 'DELETE')}>Tirtir</button>
        </>
      )}
    />
  );
}

