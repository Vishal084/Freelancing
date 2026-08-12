import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginAdmin({ email, password })).unwrap();
      navigate('/admin');
    } catch (err) {
      // error already handled by Redux state, no extra action needed
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Admin Login</h1>
        {error && <div className="error">{error}</div>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  );
};

export default Login;