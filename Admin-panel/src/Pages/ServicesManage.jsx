import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices, createService, updateService, deleteService } from '../redux/slices/servicesSlice';

const ServicesManage = () => {
  const dispatch = useDispatch();
  const { list, isLoading, error } = useSelector(state => state.services);
  const [form, setForm] = useState({ name: '', description: '', price: '', icon: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => { dispatch(fetchServices()); }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, price: Number(form.price) };
    if (editId) {
      dispatch(updateService({ id: editId, data }));
    } else {
      dispatch(createService(data));
    }
    setForm({ name: '', description: '', price: '', icon: '' });
    setEditId(null);
  };

  const handleEdit = (service) => {
    setForm({ name: service.name, description: service.description, price: service.price, icon: service.icon });
    setEditId(service.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete?')) dispatch(deleteService(id));
  };

  return (
    <div>
      <h2>Services Management</h2>
      <form onSubmit={handleSubmit} className="crud-form">
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} required />
        <input placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required />
        <input placeholder="Icon (emoji)" value={form.icon} onChange={e=>setForm({...form, icon:e.target.value})} required />
        <button type="submit">{editId ? 'Update' : 'Add'} Service</button>
      </form>

      {isLoading ? <p>Loading...</p> : (
        <table className="data-table">
          <thead><tr><th>Name</th><th>Price</th><th>Actions</th></tr></thead>
          <tbody>
            {list.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>${s.price}</td>
                <td>
                  <button onClick={() => handleEdit(s)}>Edit</button>
                  <button onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default ServicesManage;