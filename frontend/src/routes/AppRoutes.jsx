import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import About from '../pages/About/About'
import Contact from '../pages/Contact/Contact'
import Login from '../pages/Auth/Login'
import Signup from '../pages/Auth/Signup'
import Order from '../pages/Order/Order'
// import Portfolio from '../pages/Portfolio/Portfolio'
import Portfolio from '../pages/Portfolio/Portfolio'
import Services from '../pages/Services/Services'
import UserDashboard from '../pages/Dashboard/UserDashboard'
import ProtectedRoute from './ProtectedRoute'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/order" element={<Order />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/services" element={<Services />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default AppRoutes