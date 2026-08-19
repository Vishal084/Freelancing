// frontend/src/components/common/Navbar/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
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

  const hamburgerRef = useRef(null);
  const menuRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const trapStartRef = useRef(null);
  const trapEndRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    hamburgerRef.current?.focus();
  };

  const isActive = (path) => (location.pathname === path ? 'nav-active' : '');

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      const timeout = setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleTab = (e) => {
      if (!isMenuOpen) return;
      const trapStart = trapStartRef.current;
      const trapEnd = trapEndRef.current;
      if (!trapStart || !trapEnd) return;

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === trapStart) {
            e.preventDefault();
            lastFocusableRef.current?.focus();
          }
        } else {
          if (document.activeElement === trapEnd) {
            e.preventDefault();
            firstFocusableRef.current?.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isMenuOpen]);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          Websitewale24.com
        </Link>

        <button
          ref={hamburgerRef}
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`} ref={menuRef}>
          <li className="visually-hidden-focusable">
            <button
              ref={trapStartRef}
              onClick={() => lastFocusableRef.current?.focus()}
              aria-hidden="true"
              tabIndex={isMenuOpen ? 0 : -1}
            ></button>
          </li>

          <li>
            <Link
              to="/"
              className={isActive('/')}
              onClick={closeMenu}
              ref={firstFocusableRef}
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className={isActive('/services')}
              onClick={closeMenu}
              aria-current={location.pathname === '/services' ? 'page' : undefined}
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              to="/portfolio"
              className={isActive('/portfolio')}
              onClick={closeMenu}
              aria-current={location.pathname === '/portfolio' ? 'page' : undefined}
            >
              Portfolio
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={isActive('/about')}
              onClick={closeMenu}
              aria-current={location.pathname === '/about' ? 'page' : undefined}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={isActive('/contact')}
              onClick={closeMenu}
              aria-current={location.pathname === '/contact' ? 'page' : undefined}
            >
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
                  aria-current={location.pathname === '/dashboard' ? 'page' : undefined}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn-logout"
                  type="button"
                  ref={lastFocusableRef}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className={isActive('/login')}
                  onClick={closeMenu}
                  aria-current={location.pathname === '/login' ? 'page' : undefined}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className={isActive('/signup')}
                  onClick={closeMenu}
                  aria-current={location.pathname === '/signup' ? 'page' : undefined}
                  ref={lastFocusableRef}
                >
                  Signup
                </Link>
              </li>
            </>
          )}

          <li className="visually-hidden-focusable">
            <button
              ref={trapEndRef}
              onClick={() => firstFocusableRef.current?.focus()}
              aria-hidden="true"
              tabIndex={isMenuOpen ? 0 : -1}
            ></button>
          </li>
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