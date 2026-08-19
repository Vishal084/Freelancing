import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  fetchUserOrders,
  cancelOrder,
  selectUserOrders,
  selectOrdersLoading,
  selectOrdersError,
  ORDER_STATUS_COLORS,
} from '../../redux/slices/orderSlice';
import { selectCurrentUser, logout } from '../../redux/slices/authSlice';
import { formatDate, truncateText } from '../../utils/helpers';
import './Dashboard.css';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const location = useLocation();
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

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      dispatch(cancelOrder(orderId));
    }
  };

  if (!user) {
    return (
      <main className="dashboard-container">
        <div className="dashboard-card" role="alert">
          <p>Please log in to view your dashboard.</p>
          <Link
            to="/login"
            state={{ from: location.pathname }}
            className="btn btn-primary"
          >
            Log In
          </Link>
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

        {isLoading && (
          <div className="dashboard-status" role="status">
            <div className="spinner" aria-hidden="true"></div>
            <p>Loading your orders...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="dashboard-error" role="alert">
            <p>❌ Error loading orders: {error}</p>
            <button onClick={handleRetry} className="btn btn-secondary">
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && userOrders.length === 0 && (
          <div className="dashboard-empty">
            <p>You haven’t placed any orders yet.</p>
            <Link to="/services" className="btn btn-primary">
              Browse Services
            </Link>
          </div>
        )}

        {!isLoading && !error && userOrders.length > 0 && (
          <div className="orders-grid">
            {userOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <h3>{order.serviceName}</h3>
                  <span
                    className="order-status-badge"
                    style={{
                      backgroundColor: ORDER_STATUS_COLORS[order.status] || '#666',
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="order-details">{truncateText(order.details, 120)}</p>
                <div className="order-meta">
                  <span className="order-price">${order.price}</span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>
                {order.paymentStatus && (
                  <span
                    className="order-status-badge"
                    style={{
                      backgroundColor:
                        order.paymentStatus === 'paid'
                          ? '#10b981'
                          : order.paymentStatus === 'failed'
                          ? '#ef4444'
                          : '#f59e0b',
                      marginTop: '0.5rem',
                      display: 'inline-block',
                    }}
                  >
                    Payment: {order.paymentStatus}
                  </span>
                )}
                {/* ✅ Cancel button only for pending/confirmed */}
                {(order.status === 'pending' || order.status === 'confirmed') && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="btn btn-danger"
                    style={{ marginTop: '0.5rem' }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default UserDashboard;