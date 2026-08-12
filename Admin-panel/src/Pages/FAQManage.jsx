import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFAQs, addFAQ, editFAQ, removeFAQ } from '../redux/slices/faqsSlice';

const FAQManage = () => {
  const dispatch = useDispatch();
  const { list, isLoading, error } = useSelector(state => state.faqs);
  const [form, setForm] = useState({
    question: '', answer: '', order: 0, status: 'pending'
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => { dispatch(fetchFAQs()); }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, order: Number(form.order) };
    if (editId) {
      dispatch(editFAQ({ id: editId, data }));
    } else {
      dispatch(addFAQ(data));
    }
    setForm({ question: '', answer: '', order: 0, status: 'pending' });
    setEditId(null);
  };

  const handleEdit = (faq) => {
    setForm({
      question: faq.question,
      answer: faq.answer,
      order: faq.order || 0,
      status: faq.status || 'pending'
    });
    setEditId(faq._id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this FAQ?')) dispatch(removeFAQ(id));
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div>
      <h2>FAQ Management</h2>
      <form onSubmit={handleSubmit} className="crud-form">
        <input placeholder="Question" value={form.question} onChange={e => setForm({...form, question: e.target.value})} required />
        <textarea placeholder="Answer" value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} required rows={3} />
        <input placeholder="Display Order" type="number" value={form.order} onChange={e => setForm({...form, order: e.target.value})} />
        <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button type="submit">{editId ? 'Update' : 'Add'} FAQ</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ question: '', answer: '', order: 0, status: 'pending' }); }}>Cancel</button>}
      </form>

      <table className="data-table">
        <thead>
          <tr><th>Order</th><th>Question</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {list.map(faq => (
            <tr key={faq._id}>
              <td>{faq.order}</td>
              <td>{faq.question}</td>
              <td>
                <span style={{
                  padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem',
                  backgroundColor:
                    faq.status === 'approved' ? '#d4edda' :
                    faq.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                  color:
                    faq.status === 'approved' ? '#155724' :
                    faq.status === 'rejected' ? '#721c24' : '#856404'
                }}>
                  {faq.status}
                </span>
              </td>
              <td>
                <button onClick={() => handleEdit(faq)}>Edit</button>
                <button onClick={() => handleDelete(faq._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FAQManage;