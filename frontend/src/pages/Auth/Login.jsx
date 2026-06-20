// frontend/src/pages/Auth/Login.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  login,
  clearError,
  selectAuthLoading,
  selectAuthError,
} from '../../redux/slices/authSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoading = useSelector(selectAuthLoading);
  const apiError = useSelector(selectAuthError);

  // Redirect destination after login
  const from = location.state?.from || '/dashboard';

  // Clear Redux error on unmount
  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  // Clear any error when user modifies inputs
  useEffect(() => {
    if (apiError) dispatch(clearError());
    if (validationError) setValidationError('');
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Basic client-side checks
    if (!email.trim() || !password.trim()) {
      setValidationError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    const result = await dispatch(login({ email, password }));
    if (!result.error) navigate(from, { replace: true });
  };

  const errorMessage = validationError || apiError;

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Decorative side panel */}
        <div className="auth-side-panel">
          <div className="auth-side-content">
            <Link to="/" className="auth-logo">FreelancePro</Link>
            <h1>Welcome Back</h1>
            <p>Log in to manage your projects, orders, and account.</p>
            <div className="auth-side-illustration">
              {/* Replace with an actual SVG or image */}
              <svg viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="90" fill="rgba(255,255,255,0.1)" />
                <path d="M70 80h60M70 100h60M70 120h40" stroke="white" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Form side */}
        <div className="auth-form-panel">
          <div className="auth-form-card">
            <h2>Login to Your Account</h2>
            <p className="auth-subtitle">Enter your credentials to continue</p>

            {errorMessage && (
              <div className="auth-error" role="alert">
                <span className="auth-error-icon" aria-hidden="true">⚠️</span>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="login-password">Password</label>
                <div className="auth-password-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="auth-options">
                <label className="auth-remember">
                  <input type="checkbox" /> Remember me
                </label>
                <Link to="/forgot-password" className="auth-forgot">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="auth-submit-btn"
              >
                {isLoading ? (
                  <>
                    <span className="spinner" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <p className="auth-switch">
              Don’t have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;