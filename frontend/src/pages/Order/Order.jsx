// frontend/src/pages/Order/Order.jsx
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import {
  fetchServices,
  selectAllServices,
  selectServicesLoading,
  selectServicesError,
} from '../../redux/slices/serviceSlice';
import {
  createOrder,
  clearLastOrder,
  selectOrdersLoading,
  selectLastOrder,
  selectOrdersError,
  clearOrdersError,
} from '../../redux/slices/orderSlice';
import { selectCurrentUser } from '../../redux/slices/authSlice';
import './Order.css';

const Order = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service');

  const user = useSelector(selectCurrentUser);
  const services = useSelector(selectAllServices);
  const servicesLoading = useSelector(selectServicesLoading);
  const servicesError = useSelector(selectServicesError);

  const orderLoading = useSelector(selectOrdersLoading);
  const lastOrder = useSelector(selectLastOrder);
  const orderError = useSelector(selectOrdersError);

  const [selectedService, setSelectedService] = useState(null);
  const [details, setDetails] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState(false);

  // Fetch services if not already loaded
  useEffect(() => {
    if (!services.length && !servicesLoading) {
      dispatch(fetchServices());
    }
  }, [dispatch, services.length, servicesLoading]);

  // When services are loaded and a serviceId exists, try to find it
  useEffect(() => {
    if (serviceId && services.length > 0) {
      const found = services.find((s) => s.id === serviceId);
      setSelectedService(found || null);
      if (!found) {
        setFormError('The selected service was not found. Please choose one from the list below.');
      }
    }
  }, [serviceId, services]);

  // Handle successful order creation
  useEffect(() => {
    if (lastOrder) {
      setSuccessMessage(true);
      dispatch(clearLastOrder());
      // Auto‑redirect after 3 seconds
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastOrder, dispatch, navigate]);

  // Clear order error when user starts typing or on unmount
  useEffect(() => {
    return () => {
      dispatch(clearOrdersError());
    };
  }, [dispatch]);

  const clearFormErrorOnChange = useCallback(() => {
    if (formError) setFormError('');
    if (loginPrompt) setLoginPrompt(false);
    if (orderError) dispatch(clearOrdersError());
  }, [formError, loginPrompt, orderError, dispatch]);

  const handleDetailsChange = (e) => {
    setDetails(e.target.value);
    clearFormErrorOnChange();
  };

  const handleServiceSelect = (e) => {
    const id = e.target.value;
    const found = services.find((s) => s.id === id);
    setSelectedService(found || null);
    clearFormErrorOnChange();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear previous messages
    setFormError('');
    setLoginPrompt(false);
    dispatch(clearOrdersError());

    if (!user) {
      setLoginPrompt(true);
      return;
    }

    if (!selectedService) {
      setFormError('Please select a service before placing an order.');
      return;
    }

    if (!details.trim()) {
      setFormError('Please provide project details.');
      return;
    }

    dispatch(
      createOrder({
        // userId: user.id,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        details: details.trim(),
        price: selectedService.price,
      })
    );
  };

  // Loading while fetching services
  if (servicesLoading) {
    return (
      <main className="order-page-container" aria-busy="true">
        <div className="order-status-message">
          <div className="spinner" aria-hidden="true"></div>
          <p>Loading services…</p>
        </div>
      </main>
    );
  }

  // Error fetching services
  if (servicesError) {
    return (
      <main className="order-page-container" role="alert">
        <div className="order-error-block">
          <p>⚠️ Failed to load services. Please try again later.</p>
          <button onClick={() => dispatch(fetchServices())} className="btn btn-secondary">
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="order-page-container" aria-labelledby="order-heading">
      <h1 id="order-heading">Place an Order</h1>

      {/* Login prompt – friendly message instead of alert */}
      {loginPrompt && (
        <div className="order-warning" role="alert">
          <p>🔒 You need to log in before placing an order.</p>
          <Link
            to="/login"
            state={{ from: location.pathname + location.search }}
            className="btn btn-primary"
          >
            Log In
          </Link>
        </div>
      )}

      {/* Success message – replaces alert */}
      {successMessage && (
        <div className="order-success" role="status">
          <span className="success-icon">✅</span>
          <div>
            <h3>Order Placed Successfully!</h3>
            <p>Redirecting you to your dashboard in a few seconds…</p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              Go to Dashboard Now
            </button>
          </div>
        </div>
      )}

      {/* Generic form error (validation / missing service) */}
      {formError && (
        <div className="order-error-block" role="alert">
          <p>⚠️ {formError}</p>
        </div>
      )}

      {/* API error from Redux */}
      {orderError && !successMessage && (
        <div className="order-error-block" role="alert">
          <p>❌ {orderError}</p>
          <button onClick={() => dispatch(clearOrdersError())} className="btn btn-text">
            Dismiss
          </button>
        </div>
      )}

      {/* If no serviceId was passed, show a selection dropdown */}
      {!serviceId && !successMessage && (
        <div className="order-service-select">
          <label htmlFor="service-select">Choose a service:</label>
          <select
            id="service-select"
            value={selectedService?.id || ''}
            onChange={handleServiceSelect}
            disabled={services.length === 0}
          >
            <option value="">-- Select a service --</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (${s.price})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* If we have a service (pre‑selected or chosen), show the form */}
      {selectedService && !successMessage && (
        <div className="order-form-card">
          <div className="order-service-summary">
            <h2>{selectedService.name}</h2>
            <p className="order-price">${selectedService.price}</p>
            <p className="order-description">{selectedService.description}</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="order-field">
              <label htmlFor="order-details">Project Details / Requirements *</label>
              <textarea
                id="order-details"
                value={details}
                onChange={handleDetailsChange}
                rows="6"
                required
                placeholder="Describe your project, goals, timeline, and any specific needs…"
              />
            </div>

            <div className="order-actions">
              <button
                type="submit"
                disabled={orderLoading}
                className="btn btn-primary"
              >
                {orderLoading ? (
                  <>
                    <span className="spinner" aria-hidden="true"></span>
                    Placing Order...
                  </>
                ) : (
                  'Confirm Order'
                )}
              </button>
              <Link to="/services" className="btn btn-secondary">
                Browse More Services
              </Link>
            </div>
          </form>
        </div>
      )}

      {/* No service selected and no serviceId – fallback */}
      {!selectedService && !serviceId && !successMessage && (
        <div className="order-empty">
          <p>Select a service from the list above, or</p>
          <Link to="/services" className="btn btn-primary">
            Browse All Services
          </Link>
        </div>
      )}

      {/* Service ID provided but not found */}
      {serviceId && !selectedService && !servicesLoading && !successMessage && (
        <div className="order-error-block">
          <p>The service you requested doesn’t exist or was removed.</p>
          <Link to="/services" className="btn btn-primary">
            View Available Services
          </Link>
        </div>
      )}
    </main>
  );
};

export default Order;