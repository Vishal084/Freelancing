import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './Pages/Login';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './Pages/Dashboard';
import ServicesManage from './Pages/ServicesManage';
import ProjectsManage from './Pages/ProjectsManage';
import AboutEdit from './Pages/AboutEdit';
import OrdersManage from './Pages/OrdersManage';
import ContactsList from './Pages/ContactsList';
import UsersManage from './Pages/UsersManage';
import BlogManage from './Pages/BlogManage';
import TestimonialsManage from './pages/TestimonialsManage';
import FAQManage from './Pages/FAQManage';

function App() {
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
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;