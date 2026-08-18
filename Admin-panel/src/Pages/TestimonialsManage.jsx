import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTestimonials,
  addTestimonial,
  editTestimonial,
  removeTestimonial,
  clearError,
} from '../redux/slices/testimonialsSlice';

const TestimonialsManage = () => {
  const dispatch = useDispatch();
  const { list, isLoading, error } = useSelector((state) => state.testimonials);
  const [form, setForm] = useState({
    name: '',
    role: '',
    quote: '',
    avatar: '',
    status: 'approved',
  });
  const [editId, setEditId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  const resetForm = () => {
    setForm({ name: '', role: '', quote: '', avatar: '', status: 'approved' });
    setEditId(null);
  };

  const isUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');

    // Sanitize avatar: if not empty and not a valid URL, set to empty
    const payload = { ...form };
    if (payload.avatar && !isUrl(payload.avatar)) {
      payload.avatar = '';
    }

    try {
      if (editId) {
        await dispatch(editTestimonial({ id: editId, data: payload })).unwrap();
        setSuccessMsg('Testimonial updated successfully.');
      } else {
        await dispatch(addTestimonial(payload)).unwrap();
        setSuccessMsg('Testimonial added successfully.');
      }
      resetForm();
    } catch (err) {
      // Error already in Redux state
    }
  };

  const handleEdit = (testimonial) => {
    setForm({
      name: testimonial.name,
      role: testimonial.role || '',
      quote: testimonial.quote,
      avatar: testimonial.avatar || '',
      status: testimonial.status || 'approved',
    });
    setEditId(testimonial._id);
    setSuccessMsg('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this testimonial?')) {
      try {
        await dispatch(removeTestimonial(id)).unwrap();
        setSuccessMsg('Testimonial deleted.');
      } catch (err) {
        // handled by Redux
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Testimonials Management</h2>

      {error && (
        <div className="error" role="alert">
          Error: {error}
          <button onClick={() => dispatch(clearError())} style={{ marginLeft: 8 }}>
            Dismiss
          </button>
        </div>
      )}
      {successMsg && <div className="success">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="crud-form">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Role / Company"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />
        <textarea
          placeholder="Quote"
          value={form.quote}
          onChange={(e) => setForm({ ...form, quote: e.target.value })}
          required
          rows={3}
        />
        <input
          placeholder="Avatar URL (optional)"
          value={form.avatar}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button type="submit">{editId ? 'Update' : 'Add'} Testimonial</button>
        {editId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Quote</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((t) => (
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