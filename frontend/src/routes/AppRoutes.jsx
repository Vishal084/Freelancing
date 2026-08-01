// frontend/src/routes/AppRoutes.jsx
import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute';
import ErrorBoundary from '../components/ErrorBoundary';

// Lazy-loaded pages
const ForgotPassword = React.lazy(() => import('../pages/Auth/ForgotPassword'));
const Home = React.lazy(() => import('../pages/Home/Home'));
const About = React.lazy(() => import('../pages/About/About'));
const Contact = React.lazy(() => import('../pages/Contact/Contact'));
const Login = React.lazy(() => import('../pages/Auth/Login'));
const Signup = React.lazy(() => import('../pages/Auth/Signup'));
const Order = React.lazy(() => import('../pages/Order/Order'));
const Portfolio = React.lazy(() => import('../pages/Portfolio/Portfolio'));
const Services = React.lazy(() => import('../pages/Services/Services'));
const UserDashboard = React.lazy(() => import('../pages/Dashboard/UserDashboard'));
const Blog = React.lazy(() => import('../pages/Blog/Blog'));
const NotFound = React.lazy(() => import('../pages/NotFound/NotFound'));

// Placeholder component for inactive pages
const Placeholder = React.lazy(() => import('../pages/Placeholder'));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Wrapper for lazy routes with error boundary and Suspense
const RouteWithErrorBoundary = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<div className="container"><div className="spinner" /> Loading...</div>}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

const AppRoutes = () => (
  <>
    <ScrollToTop />
    <Routes>
      {/* Core pages */}
      <Route path="/" element={<RouteWithErrorBoundary><Home /></RouteWithErrorBoundary>} />
      <Route path="/about" element={<RouteWithErrorBoundary><About /></RouteWithErrorBoundary>} />
      <Route path="/contact" element={<RouteWithErrorBoundary><Contact /></RouteWithErrorBoundary>} />
      <Route path="/login" element={<RouteWithErrorBoundary><Login /></RouteWithErrorBoundary>} />
      <Route path="/signup" element={<RouteWithErrorBoundary><Signup /></RouteWithErrorBoundary>} />
      <Route path="/forgot-password" element={<RouteWithErrorBoundary><ForgotPassword /></RouteWithErrorBoundary>} />
      <Route path="/order" element={<RouteWithErrorBoundary><Order /></RouteWithErrorBoundary>} />
      <Route path="/portfolio" element={<RouteWithErrorBoundary><Portfolio /></RouteWithErrorBoundary>} />
      <Route path="/services" element={<RouteWithErrorBoundary><Services /></RouteWithErrorBoundary>} />
      <Route path="/blog" element={<RouteWithErrorBoundary><Blog /></RouteWithErrorBoundary>} />
      <Route path="/dashboard" element={
        <RouteWithErrorBoundary>
          <ProtectedRoute><UserDashboard /></ProtectedRoute>
        </RouteWithErrorBoundary>
      } />

      {/* Footer placeholder routes – no more 404s */}
      <Route path="/careers" element={<RouteWithErrorBoundary><Placeholder title="Careers" /></RouteWithErrorBoundary>} />
      <Route path="/support" element={<RouteWithErrorBoundary><Placeholder title="Support" /></RouteWithErrorBoundary>} />
      <Route path="/privacy" element={<RouteWithErrorBoundary><Placeholder title="Privacy Policy" /></RouteWithErrorBoundary>} />
      <Route path="/terms" element={<RouteWithErrorBoundary><Placeholder title="Terms of Service" /></RouteWithErrorBoundary>} />
      <Route path="/cookies" element={<RouteWithErrorBoundary><Placeholder title="Cookie Policy" /></RouteWithErrorBoundary>} />
      <Route path="/docs" element={<RouteWithErrorBoundary><Placeholder title="Documentation" /></RouteWithErrorBoundary>} />

      {/* 404 catch‑all */}
      <Route path="*" element={<RouteWithErrorBoundary><NotFound /></RouteWithErrorBoundary>} />
    </Routes>
  </>
);

export default AppRoutes;