// frontend/src/pages/Contact/Contact.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
  fetchServices,
  selectAllServices,
  selectServicesLoading,
  selectServicesError,
} from '../../redux/slices/serviceSlice';
import {
  fetchSiteSettings,
  selectSiteSettings,
} from '../../redux/slices/siteSettingsSlice';
import { submitContactForm } from '../../services/contactService';
import './Contact.css';

const STORAGE_KEY = 'contact_form';

// ✅ Validation helpers
const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  if (!phone) return true; // optional field
  const re = /^[\d+\-() ]{7,15}$/;
  return re.test(phone);
};

// ✅ Input sanitization
const sanitizeInput = (input) => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const ContactPage = () => {
  const dispatch = useDispatch();

  const servicesList = useSelector(selectAllServices);
  const servicesLoading = useSelector(selectServicesLoading);
  const servicesError = useSelector(selectServicesError);

  // 🔄 Site settings from backend
  const siteSettings = useSelector(selectSiteSettings);

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
  const [honeypot, setHoneypot] = useState('');

  // ✅ Rate limiting state
  const [submitCount, setSubmitCount] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  // Restore saved form on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        // ignore corrupted data
      }
    }
  }, []);

  // Save form data on change
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Fetch services & site settings on mount
  useEffect(() => {
    if (!servicesList.length) {
      dispatch(fetchServices());
    }
    dispatch(fetchSiteSettings());
  }, [dispatch, servicesList.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- Client‑side rate limiting (max 3 per minute) ---
    const now = Date.now();
    if (now - lastSubmitTime < 60000 && submitCount >= 3) {
      setError('Too many submissions. Please wait a minute before trying again.');
      return;
    }

    if (now - lastSubmitTime > 60000) {
      setSubmitCount(0);
    }

    // --- Validation ---
    if (!formData.name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      setError('Please enter a valid phone number (e.g., +1 555-123-4567).');
      return;
    }
    if (!formData.message.trim()) {
      setError('Message is required.');
      return;
    }

    // Honeypot check
    if (honeypot) {
      setSubmitted(true);
      resetForm();
      return;
    }

    // --- Sanitize & prepare data ---
    const sanitizedData = {
      name: sanitizeInput(formData.name.trim()),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.replace(/[^\d+\-() ]/g, ''),
      message: sanitizeInput(formData.message.trim()),
      service: formData.service,
    };

    setLoading(true);
    try {
      await submitContactForm(sanitizedData);
      setSubmitted(true);
      resetForm();
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to send message. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
      setSubmitCount((prev) => prev + 1);
      setLastSubmitTime(now);
    }
  };

  // Reset form and clear session
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      service: '',
    });
    setHoneypot('');
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ─── Dynamic contact info (from site settings, with fallback) ─────────────────
  const phone = siteSettings?.phone || '+1 (555) 123-4567';
  const email = siteSettings?.email || 'hello@techagency.com';
  const addressLine = siteSettings
    ? `${siteSettings.address}, ${siteSettings.city}, ${siteSettings.state} ${siteSettings.zip}`
    : '123 Tech Street, San Francisco, CA 94107';
  const workingHours = siteSettings?.workingHours || 'Mon-Fri 9am-6pm';
  const socialLinks = siteSettings?.socialLinks || {};

  return (
    <>
      <Helmet>
        <title>Contact Us – FreelancePro</title>
        <meta
          name="description"
          content="Get in touch with FreelancePro. We build websites, web apps, and mobile apps. Let's discuss your project and bring your ideas to life."
        />
      </Helmet>

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
                      <p>{phone}</p>
                      <span className="contact-sub">{workingHours}</span>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon email-icon" aria-hidden="true">✉️</div>
                    <div>
                      <h3>Email</h3>
                      <p>{email}</p>
                      <span className="contact-sub">Response within 24 hours</span>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon location-icon" aria-hidden="true">📍</div>
                    <div>
                      <h3>Office</h3>
                      <p>{addressLine}</p>
                    </div>
                  </div>
                </div>

                {/* Social links from backend */}
                <div className="contact-social">
                  <h3>Follow Us</h3>
                  <div className="social-links">
                    {socialLinks.twitter && (
                      <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">🐦</a>
                    )}
                    {socialLinks.linkedin && (
                      <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">💼</a>
                    )}
                    {socialLinks.github && (
                      <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">🐙</a>
                    )}
                    {socialLinks.dribbble && (
                      <a href={socialLinks.dribbble} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Dribbble">🎨</a>
                    )}
                    {socialLinks.instagram && (
                      <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">📷</a>
                    )}
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

                      {/* Honeypot */}
                      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                        <input
                          type="text"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
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
                            <>✈️ Send Message</>
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
    </>
  );
};

export default ContactPage;