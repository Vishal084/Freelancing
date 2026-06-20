// frontend/src/pages/Auth/Signup.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  signup,
  clearError,
  selectAuthLoading,
  selectAuthError,
} from '../../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectAuthLoading);
  const apiError = useSelector(selectAuthError);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (apiError) dispatch(clearError());
    if (validationError) setValidationError('');
  }, [name, email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setValidationError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    const result = await dispatch(signup({ name, email, password }));
    if (!result.error) navigate('/dashboard');
  };

  const errorMessage = validationError || apiError;

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Decorative side panel – same as login */}
        <div className="auth-side-panel">
          <div className="auth-side-content">
            <Link to="/" className="auth-logo">FreelancePro</Link>
            <h1>Join Us</h1>
            <p>Create your account and start exploring our services.</p>
            <div className="auth-side-illustration">
              <svg viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="90" fill="rgba(255,255,255,0.1)" />
                <path d="M70 90h60M70 110h60M70 130h40" stroke="white" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-card">
            <h2>Create an Account</h2>
            <p className="auth-subtitle">Fill in the details to get started</p>

            {errorMessage && (
              <div className="auth-error" role="alert">
                <span className="auth-error-icon" aria-hidden="true">⚠️</span>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label htmlFor="signup-name">Full Name</label>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="signup-email">Email Address</label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="signup-password">Password</label>
                <div className="auth-password-wrapper">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
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

              <button
                type="submit"
                disabled={isLoading}
                className="auth-submit-btn"
              >
                {isLoading ? (
                  <>
                    <span className="spinner" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;