import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../redux/slices/authSlice'

const ProtectedRoute = ({ children }) => {
  const user = useSelector(selectCurrentUser)
  return user ? children : <Navigate to="/login" />
}

export default ProtectedRoute








// // Navigate: Component that redirects to another URL
// // useSelector: Redux hook to read state from store
// import { Navigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'

// // Selector: Gets current user from Redux auth state
// // Returns user object if logged in, null if not logged in
// import { selectCurrentUser } from '../redux/slices/authSlice'

// // ProtectedRoute component - Acts as a guard/checkpoint
// // children = whatever component is wrapped inside ProtectedRoute
// // Example: <ProtectedRoute><UserDashboard /></ProtectedRoute>
// // children would be <UserDashboard />
// const ProtectedRoute = ({ children }) => {

//   // Read user from Redux store
//   // user will be:
//   // - Object { id, name, email, role } if logged in
//   // - null if not logged in
//   const user = useSelector(selectCurrentUser)

//   // THE CHECK:
//   // If user exists → render children (allow access to protected page)
//   // If user is null → redirect to /login page
//   // This redirect replaces current URL in browser history
//   // So user can't go back to protected page without logging in
//   return user ? children : <Navigate to="/login" />
// }

// export default ProtectedRoute




// User visits /dashboard
//     │
//     ▼
// AppRoutes checks: Is this a protected route?
//     │
//     ▼
// ProtectedRoute component activates
//     │
//     ▼
// useSelector(selectCurrentUser) checks Redux store
//     │
//     ├── user exists (logged in)?
//     │   │
//     │   └── YES → Render children (UserDashboard)
//     │         User sees their dashboard
//     │
//     └── user is null (not logged in)?
//         │
//         └── NO → <Navigate to="/login" />
//               Browser redirects to /login
//               URL changes from /dashboard to /login





// ┌─────────────────────────────────────────────┐
// │         ProtectedRoute Component             │
// │                                              │
// │  ┌──────────────────────────────────────┐   │
// │  │  useSelector(selectCurrentUser)      │   │
// │  │                                      │   │
// │  │  Checks Redux Store:                 │   │
// │  │  state.auth.user                     │   │
// │  └──────────────┬───────────────────────┘   │
// │                 │                            │
// │         ┌───────┴───────┐                    │
// │         │               │                    │
// │    user = {...}    user = null               │
// │         │               │                    │
// │         ▼               ▼                    │
// │  ┌─────────────┐ ┌─────────────┐            │
// │  │  Render     │ │  Redirect   │            │
// │  │  children   │ │  to /login  │            │
// │  │  (Dashboard)│ │             │            │
// │  └─────────────┘ └─────────────┘            │
// │                                              │
// └─────────────────────────────────────────────┘