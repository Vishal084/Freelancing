import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './redux/slices/authSlice';

// Pages – all imports use lowercase './pages/'
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import ServicesManage from './pages/ServicesManage';
import ProjectsManage from './pages/ProjectsManage';
import AboutEdit from './pages/AboutEdit';
import OrdersManage from './pages/OrdersManage';
import ContactsList from './pages/ContactsList';
import UsersManage from './pages/UsersManage';
import BlogManage from './pages/BlogManage';
import TestimonialsManage from './pages/TestimonialsManage';
import FAQManage from './pages/FAQManage';
import SiteSettings from './pages/SiteSettings';

function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  // ✅ Restore session on app start – verify token and refresh user data
  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="services" element={<ServicesManage />} />
          <Route path="projects" element={<ProjectsManage />} />
          <Route path="about" element={<AboutEdit />} />
          <Route path="orders" element={<OrdersManage />} />
          <Route path="contacts" element={<ContactsList />} />
          <Route path="users" element={<UsersManage />} />
          <Route path="blogs" element={<BlogManage />} />
          <Route path="testimonials" element={<TestimonialsManage />} />
          <Route path="faqs" element={<FAQManage />} />
          <Route path="settings" element={<SiteSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;