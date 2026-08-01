// frontend/src/pages/Order/Order.jsx
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // ✅ added
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

const STORAGE_KEY = 'order_form'; // session storage key

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

  // ✅ Double submission lock
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restore details from session on mount (no service logic here)
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.details) setDetails(parsed.details);
      } catch (e) {
        // ignore corrupted data
      }
    }
  }, []);

  // Unified effect: restore/override selected service once services are available
  useEffect(() => {
    if (services.length === 0) return; // wait until services are loaded

    // 1. URL param takes absolute priority
    if (serviceId) {
      const found = services.find((s) => s.id === serviceId);
      setSelectedService(found || null);
      if (!found) {
        setFormError(
          'The selected service was not found. Please choose one from the list below.'
        );
      } else {
        setFormError(''); // clear any previous error
      }
      return;
    }

    // 2. Fallback to session storage
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.serviceId) {
          const found = services.find((s) => s.id === parsed.serviceId);
          if (found) {
            setSelectedService(found);
            return;
          }
        }
      } catch (e) {}
    }

    // 3. Nothing usable – leave null (selectedService already null)
  }, [serviceId, services]);

  // Save form state to session whenever details or selectedService change
  useEffect(() => {
    const dataToSave = {
      details,
      serviceId: selectedService?.id || null,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [details, selectedService]);

  // Fetch services if not already loaded
  useEffect(() => {
    if (!services.length && !servicesLoading) {
      dispatch(fetchServices());
    }
  }, [dispatch, services.length, servicesLoading]);

  // Handle successful order creation
  useEffect(() => {
    if (lastOrder) {
      setSuccessMessage(true);
      dispatch(clearLastOrder());
      sessionStorage.removeItem(STORAGE_KEY);
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastOrder, dispatch, navigate]);

  // Clear order error on unmount
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Prevent double submission
    if (isSubmitting) return;

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

    // ✅ Validate that the price hasn't changed since selection
    const currentService = services.find((s) => s.id === selectedService.id);
    if (!currentService || selectedService.price !== currentService.price) {
      setFormError('Service price has changed. Please re-select the service.');
      return;
    }

    // Lock submission
    setIsSubmitting(true);

    try {
      await dispatch(
        createOrder({
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          details: details.trim(),
          price: selectedService.price,
        })
      );
    } finally {
      // Release lock regardless of success/failure
      setIsSubmitting(false);
    }
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
    <>
      {/* ✅ SEO meta tags added */}
      <Helmet>
        <title>Place Your Order – FreelancePro</title>
        <meta
          name="description"
          content="Choose from our professional services and place your order. Provide your project details and we’ll get started right away."
        />
      </Helmet>

      <main className="order-page-container" aria-labelledby="order-heading">
        <h1 id="order-heading">Place an Order</h1>

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

        {formError && (
          <div className="order-error-block" role="alert">
            <p>⚠️ {formError}</p>
          </div>
        )}

        {orderError && !successMessage && (
          <div className="order-error-block" role="alert">
            <p>❌ {orderError}</p>
            <button onClick={() => dispatch(clearOrdersError())} className="btn btn-text">
              Dismiss
            </button>
          </div>
        )}

        {/* Service selection when no serviceId */}
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
                  disabled={orderLoading || isSubmitting}
                  className="btn btn-primary"
                >
                  {orderLoading || isSubmitting ? (
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

        {!selectedService && !serviceId && !successMessage && (
          <div className="order-empty">
            <p>Select a service from the list above, or</p>
            <Link to="/services" className="btn btn-primary">
              Browse All Services
            </Link>
          </div>
        )}

        {serviceId && !selectedService && !servicesLoading && !successMessage && (
          <div className="order-error-block">
            <p>The service you requested doesn’t exist or was removed.</p>
            <Link to="/services" className="btn btn-primary">
              View Available Services
            </Link>
          </div>
        )}
      </main>
    </>
  );
};

export default Order;