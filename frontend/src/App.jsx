import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/common/Navbar/Navbar';
import Footer from './components/common/Footer/Footer';
import { useEffect } from 'react';




import { useDispatch } from 
'react-redux';


// verifyToken - Checks if stored JWT token is still valid
// If token expired → auto logout, if valid → restore user session
import { verifyToken } from './redux/slices/authSlice';

function App() {
  console.log('VITE_API_URL is:', import.meta.env.VITE_API_URL);



  // Get dispatch function
  // // Used to send Redux actions (like verifyToken)
  // const dispatch = useDispatch()
  const dispatch = useDispatch();

  useEffect(() => {
    // Only verify if a token actually exists – prevents 401 loop on first load
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(verifyToken());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <AppRoutes />
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;



// useEffect - Runs code when component mounts (used for token verification)
// useDispatch - Sends actions to Redux store
// BrowserRouter - Enables clean URLs (no #) for page navigation
// Routes/Route handled inside AppRoutes component
// AppRoutes contains all route definitions (/, /about, /login, /dashboard, etc.)
// Navbar - Top navigation bar (visible on all pages)
// Footer - Bottom footer section (visible on all pages)




//  Token verification on app mount
  // Runs ONCE when App component first loads
  // Checks localStorage for existing token
  // Sends request to GET /api/auth/me to verify token validity
  // If valid: user stays logged in
  // If invalid: token removed, user logged out
  // useEffect(() => {
  //   dispatch(verifyToken())
  // }, [dispatch]) // Empty dependency array = runs only on mount




//    Execution Flow (What Happens When App Loads):
// text
// App.jsx Mounts
//     │
//     ├── STEP 1: console.log API URL (debug)
//     │
//     ├── STEP 2: dispatch(verifyToken())
//     │         │
//     │         ├── Check localStorage for 'token'
//     │         │
//     │         ├── Token Found? → GET /api/auth/me
//     │         │         │
//     │         │         ├── Valid → User restored in Redux
//     │         │         │         Navbar shows: Dashboard + Logout
//     │         │         │
//     │         │         └── Invalid → Token removed
//     │         │                     Navbar shows: Login + Signup
//     │         │
//     │         └── No Token → Nothing happens
//     │                         Navbar shows: Login + Signup
//     │
//     └── STEP 3: Render Layout
//               │
//               ├── <BrowserRouter> starts listening to URL
//               │
//               ├── <Navbar> appears at top
//               │
//               ├── <main>
//               │     └── <AppRoutes>
//               │           │
//               │           ├── URL is '/' → Show Home page
//               │           ├── URL is '/login' → Show Login page
//               │           ├── URL is '/dashboard' → Check ProtectedRoute
//               │           │         │
//               │           │         ├── User logged in? → Show Dashboard
//               │           │         └── No user? → Redirect to /login
//               │           └── ... other routes
//               │
//               └── <Footer> appears at bottom
// 📊 Component Tree from App.jsx:
// text
// App.jsx
// │
// ├── BrowserRouter (URL listener)
// │
// ├── useEffect → verifyToken() (Auth check)
// │
// └── Layout Structure:
//     │
//     ├── Navbar
//     │    ├── Logo (FreelancePro)
//     │    ├── Navigation Links
//     │    │    ├── Home
//     │    │    ├── Services
//     │    │    ├── Portfolio
//     │    │    ├── About
//     │    │    └── Contact
//     │    └── Auth Section
//     │         ├── If Logged In:
//     │         │    ├── Dashboard Link
//     │         │    └── Logout Button
//     │         └── If Logged Out:
//     │              ├── Login Link
//     │              └── Signup Link
//     │
//     ├── <main>
//     │    └── AppRoutes
//     │         ├── <Route path="/" element={<Home />} />
//     │         ├── <Route path="/about" element={<About />} />
//     │         ├── <Route path="/contact" element={<Contact />} />
//     │         ├── <Route path="/login" element={<Login />} />
//     │         ├── <Route path="/signup" element={<Signup />} />
//     │         ├── <Route path="/order" element={<Order />} />
//     │         ├── <Route path="/portfolio" element={<Portfolio />} />
//     │         ├── <Route path="/services" element={<Services />} />
//     │         └── <Route path="/dashboard" element={
//     │              <ProtectedRoute>
//     │                  <UserDashboard />
//     │              </ProtectedRoute>
//     │         } />
//     │
//     └── Footer
//          ├── Company Info + Social Links
//          ├── Quick Links (Services, Company, Resources)
//          └── Contact Info + Copyright





// useEffect     - Runs code when component mounts (used for token verification on app load)
// useDispatch   - Sends actions/commands to Redux store (used to dispatch verifyToken)
// BrowserRouter - Enables clean URL navigation without page reload (wraps entire app)
// AppRoutes     - Contains all route/page definitions (maps URLs to page components)
// Navbar        - Top navigation bar component (visible on all pages)
// Footer        - Bottom footer component (visible on all pages)
// verifyToken   - Redux action that checks if stored JWT token is still valid




// What Happens When App.jsx Loads:
// text
// 1. App component mounts
//    │
// 2. console.log → Shows API URL in browser console
//    │
// 3. useDispatch → Gets Redux dispatch function
//    │
// 4. useEffect runs → dispatch(verifyToken())
//    │
//    ├── Checks localStorage for 'token'
//    │
//    ├── Token exists? → Call GET /api/auth/me
//    │   ├── Success → User data saved in Redux store
//    │   │            Navbar shows: Dashboard + Logout
//    │   └── Failed  → Token removed from localStorage
//    │                Navbar shows: Login + Signup
//    │
//    └── No token? → Nothing happens
//                    Navbar shows: Login + Signup
//    │
// 5. Render layout:
//    ├── BrowserRouter starts
//    ├── Navbar appears at top
//    ├── Current page renders in <main>
//    └── Footer appears at bottom
// 📊 Visual Structure:
// text
// ┌─────────────────────────────────────────┐
// │            BrowserRouter                │
// │  ┌───────────────────────────────────┐  │
// │  │           Navbar                   │  │
// │  │  Logo | Home | Services | About   │  │
// │  │              Login | Signup        │  │
// │  └───────────────────────────────────┘  │
// │  ┌───────────────────────────────────┐  │
// │  │         <main>                     │  │
// │  │                                    │  │
// │  │       Current Page Renders         │  │
// │  │       (Home/About/Login etc)       │  │
// │  │                                    │  │
// │  └───────────────────────────────────┘  │
// │  ┌───────────────────────────────────┐  │
// │  │           Footer                   │  │
// │  │  Links | Social | Contact | ©      │  │
// │  └───────────────────────────────────┘  │
// └─────────────────────────────────────────┘
