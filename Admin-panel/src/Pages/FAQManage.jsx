import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFAQs, addFAQ, editFAQ, removeFAQ } from '../redux/slices/faqsSlice';

const FAQManage = () => {
  const dispatch = useDispatch();
  const { list, isLoading } = useSelector(state => state.faqs);
  const [form, setForm] = useState({ question: '', answer: '', order: 0 });
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
    setForm({ question: '', answer: '', order: 0 });
    setEditId(null);
  };

  const handleEdit = (faq) => {
    setForm({ question: faq.question, answer: faq.answer, order: faq.order || 0 });
    setEditId(faq.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this FAQ?')) dispatch(removeFAQ(id));
  };

  return (
    <div>
      <h2>FAQ Management</h2>
      <form onSubmit={handleSubmit} className="crud-form">
        <input placeholder="Question" value={form.question} onChange={e => setForm({...form, question: e.target.value})} required />
        <textarea placeholder="Answer" value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} required rows={3} />
        <input placeholder="Display Order" type="number" value={form.order} onChange={e => setForm({...form, order: e.target.value})} />
        <button type="submit">{editId ? 'Update' : 'Add'} FAQ</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ question: '', answer: '', order: 0 }); }}>Cancel</button>}
      </form>

      {isLoading ? <p>Loading...</p> : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Question</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(faq => (
              <tr key={faq.id}>
                <td>{faq.order}</td>
                <td>{faq.question}</td>
                <td>
                  <button onClick={() => handleEdit(faq)}>Edit</button>
                  <button onClick={() => handleDelete(faq.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FAQManage;