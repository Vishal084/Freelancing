// frontend/src/pages/Dashboard/UserDashboard.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchUserOrders,
  selectUserOrders,
  selectOrdersLoading,
  selectOrdersError,
} from '../../redux/slices/orderSlice';
import { selectCurrentUser, logout } from '../../redux/slices/authSlice';
import './Dashboard.css';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const userOrders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    if (user) dispatch(fetchUserOrders());
  }, [dispatch, user]);

  const handleRetry = () => {
    dispatch(fetchUserOrders());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  // If user is not logged in (shouldn't happen due to ProtectedRoute, but safety)
  if (!user) {
    return (
      <main className="dashboard-container">
        <div className="dashboard-card" role="alert">
          <p>Please log in to view your dashboard.</p>
          <Link to="/login" className="btn btn-primary">Log In</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-container" aria-labelledby="dashboard-heading">
      <div className="dashboard-header">
        <div>
          <h1 id="dashboard-heading">Dashboard</h1>
          <p className="welcome-message">Welcome back, {user.name}!</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline-logout">
          Logout
        </button>
      </div>

      <section className="dashboard-section" aria-labelledby="orders-heading">
        <h2 id="orders-heading">My Orders</h2>

        {/* Loading state */}
        {isLoading && (
          <div className="dashboard-status" role="status">
            <div className="spinner" aria-hidden="true"></div>
            <p>Loading your orders...</p>
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div className="dashboard-error" role="alert">
            <p>❌ Error loading orders: {error}</p>
            <button onClick={handleRetry} className="btn btn-secondary">
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && userOrders.length === 0 && (
          <div className="dashboard-empty">
            <p>You haven’t placed any orders yet.</p>
            <Link to="/services" className="btn btn-primary">
              Browse Services
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!isLoading && !error && userOrders.length > 0 && (
          <div className="orders-grid">
            {userOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <h3>{order.serviceName}</h3>
                  <span className={`order-status-badge ${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <p className="order-details">{order.details}</p>
                <div className="order-meta">
                  <span className="order-price">${order.price}</span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default UserDashboard;