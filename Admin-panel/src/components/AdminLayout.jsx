import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import ErrorBoundary from './ErrorBoundary';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        {user && <p className="admin-welcome">Welcome, {user.name}</p>}
        <nav>
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/services">Services</NavLink>
          <NavLink to="/admin/projects">Projects</NavLink>
          <NavLink to="/admin/about">About</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/contacts">Contacts</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/blogs">Blogs</NavLink>
          <NavLink to="/admin/testimonials">Testimonials</NavLink>
          <NavLink to="/admin/faqs">FAQs</NavLink>
          <NavLink to="/admin/settings">Site Settings</NavLink>
        </nav>
        <button onClick={handleLogout}>Logout</button>
      </aside>
      <main className="admin-content">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default AdminLayout;