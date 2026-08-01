// frontend/src/components/common/Navbar/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../../../redux/slices/authSlice';
import './Navbar.css';

const Navbar = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setIsMenuOpen(false);

  // ✅ Active route helper
  const isActive = (path) => (location.pathname === path ? 'nav-active' : '');

  // ✅ Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // ✅ Scroll lock & focus trap when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Small delay to allow the DOM to update, then focus the first link
      setTimeout(() => {
        const firstLink = document.querySelector('.nav-links.active a');
        firstLink?.focus();
      }, 0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

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
          <li>
            <Link to="/" className={isActive('/')} onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/services" className={isActive('/services')} onClick={closeMenu}>
              Services
            </Link>
          </li>
          <li>
            <Link to="/portfolio" className={isActive('/portfolio')} onClick={closeMenu}>
              Portfolio
            </Link>
          </li>
          <li>
            <Link to="/about" className={isActive('/about')} onClick={closeMenu}>
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className={isActive('/contact')} onClick={closeMenu}>
              Contact
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className={isActive('/dashboard')}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className={isActive('/login')} onClick={closeMenu}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className={isActive('/signup')} onClick={closeMenu}>
                  Signup
                </Link>
              </li>
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