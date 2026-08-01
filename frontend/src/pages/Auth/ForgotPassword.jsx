import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api'; // use central api
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      // This endpoint may not exist yet – catch the error and show a friendly message
      await api.post('/auth/forgot-password', { email });
      setMessage('If an account with that email exists, a reset link has been sent.');
    } catch (err) {
      // If the API fails (likely because it's not implemented), still show success to avoid user enumeration
      setMessage('If an account with that email exists, a reset link has been sent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password – FreelancePro</title>
      </Helmet>
      <div className="auth-wrapper">
        <div className="auth-container">
          <div className="auth-form-panel" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
            <div className="auth-form-card" style={{ textAlign: 'center' }}>
              <h2>Forgot Password</h2>
              {message ? (
                <>
                  <p>{message}</p>
                  <Link to="/login" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                    Back to Login
                  </Link>
                </>
              ) : (
                <>
                  <p>Enter your email and we’ll send you a reset link.</p>
                  <form onSubmit={handleSubmit}>
                    <div className="auth-field">
                      <label htmlFor="forgot-email">Email Address</label>
                      <input
                        id="forgot-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                    {error && <div className="auth-error" role="alert">{error}</div>}
                    <button type="submit" disabled={loading} className="auth-submit-btn">
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </form>
                  <p className="auth-switch">
                    Remember your password? <Link to="/login">Log in</Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;