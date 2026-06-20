// frontend/src/pages/Contact/Contact.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchServices,
  selectAllServices,
  selectServicesLoading,
  selectServicesError,
} from '../../redux/slices/serviceSlice';
import { submitContactForm } from '../../services/contactService';
import './Contact.css';


const ContactPage = () => {
  const dispatch = useDispatch();

  // Get services from Redux (live from API)
  const servicesList = useSelector(selectAllServices);
  const servicesLoading = useSelector(selectServicesLoading);
  const servicesError = useSelector(selectServicesError);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    service: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Fetch services when component mounts (only if not already present)
  useEffect(() => {
    if (!servicesList.length) {
      dispatch(fetchServices());
    }
  }, [dispatch, servicesList.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await submitContactForm(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        service: '',
      });
      // Auto‑dismiss success message after 8 seconds (longer for readability)
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err) {
      // Extract a meaningful message from the error if possible
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to send message. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="contact-page" aria-labelledby="contact-heading">
      <div className="contact-bg-overlay" aria-hidden="true"></div>

      <div className="container contact-container">
        {/* Header */}
        <div className="contact-header">
          <div className="contact-header-line">
            <span aria-hidden="true"></span>
            <span>GET IN TOUCH</span>
            <span aria-hidden="true"></span>
          </div>
          <h1 id="contact-heading">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h1>
          <p>
            Have a project in mind? Let&apos;s discuss how we can help bring your ideas to life.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Information */}
          <div className="contact-info">
            <div className="contact-info-card">
              <h2 className="sr-only">Contact Details</h2>
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon phone-icon" aria-hidden="true">📞</div>
                  <div>
                    <h3>Phone</h3>
                    <p>+1 (555) 123-4567</p>
                    <span className="contact-sub">Mon-Fri 9am-6pm</span>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon email-icon" aria-hidden="true">✉️</div>
                  <div>
                    <h3>Email</h3>
                    <p>hello@techagency.com</p>
                    <span className="contact-sub">Response within 24 hours</span>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon location-icon" aria-hidden="true">📍</div>
                  <div>
                    <h3>Office</h3>
                    <p>123 Tech Street</p>
                    <span className="contact-sub">San Francisco, CA 94107</span>
                  </div>
                </div>
              </div>

              <div className="contact-social">
                <h3>Follow Us</h3>
                <div className="social-links">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">🐦</a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">💼</a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">🐙</a>
                  <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Dribbble">🎨</a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <div className="contact-form-card">
              {submitted ? (
                <div className="success-message" role="status">
                  <div className="success-icon" aria-hidden="true">✅</div>
                  <h3>Message Sent Successfully!</h3>
                  <p>
                    Thank you for contacting us. We&apos;ve received your message and will get back to you within 24 hours.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-primary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h3>Send us a Message</h3>
                  <p>Fill out the form below and we&apos;ll get back to you soon.</p>

                  {error && (
                    <div className="error-message" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="contact-form" noValidate>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="contact-name">Your Name *</label>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="contact-email">Email Address *</label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="contact-phone">Phone Number</label>
                        <input
                          id="contact-phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="contact-service">Service Interested In</label>
                        <select
                          id="contact-service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          disabled={servicesLoading}
                        >
                          <option value="">
                            {servicesLoading ? 'Loading services...' : 'Select a service'}
                          </option>
                          {!servicesLoading &&
                            servicesList.map((service) => (
                              <option key={service.id} value={service.name}>
                                {service.name}
                              </option>
                            ))}
                        </select>
                        {servicesError && (
                          <small className="field-error">
                            Could not load services. Please refresh or select &quot;Other&quot;.
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="contact-message">Message *</label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        placeholder="Tell us about your project..."
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? (
                          <>
                            <span className="spinner" aria-hidden="true"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            ✈️ Send Message
                          </>
                        )}
                      </button>
                      <span className="required-note">* Required fields</span>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;