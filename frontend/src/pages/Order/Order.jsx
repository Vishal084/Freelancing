import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  fetchServices,
  selectAllServices,
  selectServicesLoading,
  selectServicesError,
} from '../../redux/slices/serviceSlice';
import { selectCurrentUser } from '../../redux/slices/authSlice';
import paymentService from '../../services/paymentService';
import { loadRazorpayScript } from '../../utils/loadRazorpayScript';
import './Order.css';

const STORAGE_KEY = 'order_form';

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

  const [selectedService, setSelectedService] = useState(null);
  const [details, setDetails] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Restore details from session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.details) setDetails(parsed.details);
      } catch (e) {}
    }
  }, []);

  // Unified effect: restore/override selected service once services are available
  useEffect(() => {
    if (services.length === 0) return;

    if (serviceId) {
      const found = services.find(
        (s) => s._id === serviceId || s.id === serviceId
      );
      setSelectedService(found || null);
      if (!found) {
        setFormError('The selected service was not found. Please choose one from the list below.');
      } else {
        setFormError('');
      }
      return;
    }

    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.serviceId) {
          const found = services.find(
            (s) => s._id === parsed.serviceId || s.id === parsed.serviceId
          );
          if (found) {
            setSelectedService(found);
            return;
          }
        }
      } catch (e) {}
    }
  }, [serviceId, services]);

  // Save form state to session
  useEffect(() => {
    const dataToSave = {
      details,
      serviceId: selectedService?._id || selectedService?.id || null,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [details, selectedService]);

  // Fetch services if not already loaded
  useEffect(() => {
    if (!services.length && !servicesLoading) {
      dispatch(fetchServices());
    }
  }, [dispatch, services.length, servicesLoading]);

  // Redirect to dashboard a few seconds after a successful payment
  useEffect(() => {
    if (successMessage) {
      sessionStorage.removeItem(STORAGE_KEY);
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  const clearFormErrorOnChange = useCallback(() => {
    if (formError) setFormError('');
    if (paymentError) setPaymentError('');
  }, [formError, paymentError]);

  const handleDetailsChange = (e) => {
    setDetails(e.target.value);
    clearFormErrorOnChange();
  };

  const handleServiceSelect = (e) => {
    const id = e.target.value;
    const found = services.find((s) => s._id === id || s.id === id);
    setSelectedService(found || null);
    clearFormErrorOnChange();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError('');
    setPaymentError('');

    if (!selectedService) {
      setFormError('Please select a service before placing an order.');
      return;
    }
    if (!details.trim()) {
      setFormError('Please provide project details.');
      return;
    }

    // ✅ Get the latest service data from Redux
    const selectedServiceId = selectedService._id || selectedService.id;
    const currentService = services.find(
      (s) => (s._id || s.id) === selectedServiceId
    );

    if (!currentService) {
      setFormError('The selected service is no longer available.');
      return;
    }

    // ✅ Compare numeric prices to avoid type mismatch
    if (Number(selectedService.price) !== Number(currentService.price)) {
      setFormError('Service price has changed. Please re-select the service.');
      return;
    }

    setIsSubmitting(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setPaymentError('Unable to load Razorpay checkout. Please check your connection and try again.');
        return;
      }

      const serviceId = currentService._id || currentService.id;
      const { razorpayOrder } = await paymentService.createRazorpayOrder(
        serviceId,
        details.trim()
      );

      const options = {
        key: razorpayOrder.key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'FreelancePro',
        description: `Payment for ${currentService.name}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: '#4f46e5' },
        handler: async (response) => {
          try {
            await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setSuccessMessage(true);
          } catch (verifyErr) {
            setPaymentError(
              verifyErr.response?.data?.message ||
                'Payment was received but verification failed. Please contact support.'
            );
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setIsSubmitting(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setPaymentError(response.error?.description || 'Payment failed. Please try again.');
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      setPaymentError(
        err.response?.data?.message || err.message || 'Failed to initiate payment. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

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

  if (!user) {
    return (
      <>
        <Helmet>
          <title>Login Required – FreelancePro</title>
          <meta name="description" content="You need to be logged in to place an order." />
        </Helmet>
        <main className="order-page-container" aria-labelledby="order-heading">
          <h1 id="order-heading">Place an Order</h1>
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
        </main>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Place Your Order – FreelancePro</title>
        <meta
          name="description"
          content="Choose from our professional services and place your order. Provide your project details and we’ll get started right away."
        />
      </Helmet>

      <main className="order-page-container" aria-labelledby="order-heading">
        <h1 id="order-heading">Place an Order</h1>

        {successMessage && (
          <div className="order-success" role="status">
            <span className="success-icon">✅</span>
            <div>
              <h3>Payment Successful!</h3>
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

        {paymentError && !successMessage && (
          <div className="order-error-block" role="alert">
            <p>❌ {paymentError}</p>
            <button onClick={() => setPaymentError('')} className="btn btn-text">
              Dismiss
            </button>
          </div>
        )}

        {!serviceId && !successMessage && (
          <div className="order-service-select">
            <label htmlFor="service-select">Choose a service:</label>
            <select
              id="service-select"
              value={selectedService?._id || selectedService?.id || ''}
              onChange={handleServiceSelect}
              disabled={services.length === 0}
            >
              <option value="">-- Select a service --</option>
              {services.map((s) => (
                <option key={s._id || s.id} value={s._id || s.id}>
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
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner" aria-hidden="true"></span>
                      Processing Payment...
                    </>
                  ) : (
                    'Pay with Razorpay'
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