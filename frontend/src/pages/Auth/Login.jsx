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
  const [rememberMe, setRememberMe] = useState(false);            // ✅ remember me

  // ✅ Account lockout state
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);

  // Track which fields have been interacted with
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoading = useSelector(selectAuthLoading);
  const apiError = useSelector(selectAuthError);

  // Redirect destination after login
  const from = location.state?.from || '/dashboard';

  // Restore lockout state from localStorage on mount
  useEffect(() => {
    const savedLockout = localStorage.getItem('lockoutUntil');
    if (savedLockout) {
      const lockoutTime = parseInt(savedLockout, 10);
      if (Date.now() < lockoutTime) {
        setLockoutUntil(lockoutTime);
        setLoginAttempts(5);
      } else {
        localStorage.removeItem('lockoutUntil');
      }
    }
  }, []);

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

    // ✅ Check lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const minutesLeft = Math.ceil((lockoutUntil - Date.now()) / 60000);
      setValidationError(
        `Too many attempts. Try again in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}.`
      );
      return;
    }

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

    if (result.error) {
      // ✅ Increment failed attempts and maybe lock out
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= 5) {
        const lockoutTime = Date.now() + 15 * 60 * 1000; // 15 minutes
        setLockoutUntil(lockoutTime);
        localStorage.setItem('lockoutUntil', lockoutTime.toString());
        setValidationError('Account temporarily locked. Try again in 15 minutes.');
      }
    } else {
      // ✅ Successful login – reset attempts, store "Remember Me" preference
      setLoginAttempts(0);
      setLockoutUntil(null);
      localStorage.removeItem('lockoutUntil');

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      navigate(from, { replace: true });
    }
  };

  const errorMessage = validationError || apiError;   // ✅ fine as is

  // Helper to mark field as touched
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Determine validity classes
  const isEmailValid = touched.email && email.length > 0;
  const isPasswordValid = touched.password && password.length >= 6;

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Decorative side panel */}
        <div className="auth-side-panel">
          <div className="auth-side-content">
            <Link to="/" className="auth-logo">
              FreelancePro
            </Link>
            <h1>Welcome Back</h1>
            <p>Log in to manage your projects, orders, and account.</p>
            <div className="auth-side-illustration">
              <svg viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="90" fill="rgba(255,255,255,0.1)" />
                <path
                  d="M70 80h60M70 100h60M70 120h40"
                  stroke="white"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
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
              {/* Email field with valid indicator */}
              <div className={`auth-field ${isEmailValid ? 'valid' : ''}`}>
                <label htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password field with valid indicator */}
              <div className={`auth-field ${isPasswordValid ? 'valid' : ''}`}>
                <label htmlFor="login-password">Password</label>
                <div className="auth-password-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
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
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
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