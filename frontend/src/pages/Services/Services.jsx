// frontend/src/pages/Services/Services.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchServices,
  selectAllServices,
  selectServicesLoading,
  selectServicesError,
} from '../../redux/slices/serviceSlice';
import ServiceCard from '../../components/cards/ServiceCard/ServiceCard';
import './Services.css';

const Services = () => {
  const dispatch = useDispatch();
  const services = useSelector(selectAllServices);
  const isLoading = useSelector(selectServicesLoading);
  const error = useSelector(selectServicesError);

  const [retryTrigger, setRetryTrigger] = useState(false);

  useEffect(() => {
    dispatch(fetchServices());
    window.scrollTo(0, 0);
  }, [dispatch, retryTrigger]);

  const handleRetry = () => setRetryTrigger((prev) => !prev);

  return (
    <main className="container services-page" aria-labelledby="services-heading">
      <h1 id="services-heading">All Services</h1>

      {/* Loading state */}
      {isLoading && (
        <div className="section-loading" role="status">
          <div className="spinner" aria-hidden="true"></div>
          <p>Loading services...</p>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="section-error" role="alert">
          <p>⚠️ Failed to load services. Please try again later.</p>
          <button onClick={handleRetry} className="btn btn-secondary">
            Retry
          </button>
        </div>
      )}

      {/* Normal state: services found */}
      {!isLoading && !error && services.length > 0 && (
        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

      {/* Empty state: no services in database */}
      {!isLoading && !error && services.length === 0 && (
        <div className="section-empty">
          <p>No services available right now.</p>
          <p>
            Please check back later or{' '}
            <a href="/contact">contact us</a> for a custom quote.
          </p>
        </div>
      )}
    </main>
  );
};

export default Services;