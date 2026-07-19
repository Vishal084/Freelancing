import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const handleLogout = () => { dispatch(logout()); navigate('/login'); };
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/services">Services</Link>
          <Link to="/admin/projects">Projects</Link>
          <Link to="/admin/about">About</Link>
          <Link to="/admin/orders">Orders</Link>
          <Link to="/admin/contacts">Contacts</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/blogs">Blogs</Link>
          <Link to="/admin/testimonials">Testimonials</Link>
          <Link to="/admin/faqs">FAQs</Link>
        </nav>
        <button onClick={handleLogout}>Logout</button>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};
export default AdminLayout;