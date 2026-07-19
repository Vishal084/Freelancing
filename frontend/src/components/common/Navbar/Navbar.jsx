// frontend/src/components/common/Navbar/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../../../redux/slices/authSlice';
import './Navbar.css';

const Navbar = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          FreelancePro
        </Link>

        <button
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
          <li><Link to="/portfolio" onClick={closeMenu}>Portfolio</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
          {user ? (
            <>
              <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
              <li><Link to="/signup" onClick={closeMenu}>Signup</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;




// useState       - React hook for managing component state (menu open/close)
// Link           - React Router component for navigation links (no page reload)
// useNavigate    - React Router hook for programmatic navigation (redirect after logout)
// useDispatch    - Redux hook to send actions to store
// useSelector    - Redux hook to read data from store
// logout         - Redux action to clear auth state and localStorage
// selectCurrentUser - Selector that returns current user object (or null)






// Navbar Renders
//     │
//     ├── Check: useSelector(selectCurrentUser)
//     │
//     ├── user exists?
//     │   │
//     │   ├── YES → Show: Dashboard + Logout button
//     │   │
//     │   └── NO → Show: Login + Signup links
//     │
//     └── Mobile: Hamburger button toggles isMenuOpen
//          │
//          ├── isMenuOpen = true → Add 'active' class → Show dropdown
//          └── isMenuOpen = false → Hide dropdown