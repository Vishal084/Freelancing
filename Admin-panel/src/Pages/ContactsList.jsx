import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts, removeContact } from '../redux/slices/contactsSlice';

const ContactsList = () => {
  const dispatch = useDispatch();
  const { list, isLoading } = useSelector(state => state.contacts);
  useEffect(() => { dispatch(fetchContacts()); }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this message?')) dispatch(removeContact(id));
  };

  if (isLoading) return <p>Loading contacts...</p>;

  return (
    <div>
      <h2>Contacts</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Service</th>
            <th>Message</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map(c => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone || '-'}</td>
              <td>{c.service || '-'}</td>
              <td>{c.message.slice(0, 60)}...</td>
              <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDelete(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ContactsList;