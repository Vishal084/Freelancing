import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, removeUser, banUser, adminUser } from '../redux/slices/usersSlice';

const UsersManage = () => {
  const dispatch = useDispatch();
  const { list, isLoading } = useSelector(state => state.users);
  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this user permanently?')) dispatch(removeUser(id));
  };

  const handleBanToggle = (id) => {
    dispatch(banUser(id));
  };

  const handleAdminToggle = (id) => {
    dispatch(adminUser(id));
  };

  if (isLoading) return <p>Loading users...</p>;

  return (
    <div>
      <h2>User Management</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Banned</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.isAdmin ? 'Yes' : 'No'}
                <button onClick={() => handleAdminToggle(user._id)} style={{ marginLeft: 8 }}>Toggle</button>
              </td>
              <td>
                {user.isBanned ? 'Yes' : 'No'}
                <button onClick={() => handleBanToggle(user._id)} style={{ marginLeft: 8 }}>Toggle</button>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default UsersManage;