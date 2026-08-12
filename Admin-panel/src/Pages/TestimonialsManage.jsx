import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTestimonials, addTestimonial, editTestimonial, removeTestimonial } from '../redux/slices/testimonialsSlice';

const TestimonialsManage = () => {
  const dispatch = useDispatch();
  const { list, isLoading, error } = useSelector(state => state.testimonials);
  const [form, setForm] = useState({
    name: '', role: '', quote: '', avatar: '', status: 'approved'
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => { dispatch(fetchTestimonials()); }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      dispatch(editTestimonial({ id: editId, data: form }));
    } else {
      dispatch(addTestimonial(form));
    }
    setForm({ name: '', role: '', quote: '', avatar: '', status: 'approved' });
    setEditId(null);
  };

  const handleEdit = (testimonial) => {
    setForm({
      name: testimonial.name,
      role: testimonial.role || '',
      quote: testimonial.quote,
      avatar: testimonial.avatar || '',
      status: testimonial.status || 'approved'
    });
    setEditId(testimonial._id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this testimonial?')) dispatch(removeTestimonial(id));
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div>
      <h2>Testimonials Management</h2>
      <form onSubmit={handleSubmit} className="crud-form">
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input placeholder="Role / Company" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
        <textarea placeholder="Quote" value={form.quote} onChange={e => setForm({...form, quote: e.target.value})} required rows={3} />
        <input placeholder="Avatar URL (optional)" value={form.avatar} onChange={e => setForm({...form, avatar: e.target.value})} />
        <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button type="submit">{editId ? 'Update' : 'Add'} Testimonial</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '', role: '', quote: '', avatar: '', status: 'approved' }); }}>Cancel</button>}
      </form>

      <table className="data-table">
        <thead>
          <tr><th>Name</th><th>Role</th><th>Quote</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {list.map(t => (
            <tr key={t._id}>
              <td>{t.name}</td>
              <td>{t.role}</td>
              <td>{t.quote.slice(0, 50)}...</td>
              <td>{t.status}</td>
              <td>
                <button onClick={() => handleEdit(t)}>Edit</button>
                <button onClick={() => handleDelete(t._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestimonialsManage;