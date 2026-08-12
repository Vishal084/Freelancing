// frontend/src/pages/FAQ/FAQ.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
  fetchPublicFAQs,
  submitFAQ,
  selectFAQs,
  selectFAQLoading,
  selectFAQError,
  clearFAQError,
} from '../../redux/slices/faqSlice';
import './FAQ.css';

const FAQPage = () => {
  const dispatch = useDispatch();
  const faqs = useSelector(selectFAQs);
  const isLoading = useSelector(selectFAQLoading);
  const error = useSelector(selectFAQError);

  const [form, setForm] = useState({ question: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    dispatch(fetchPublicFAQs());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question.trim()) {
      setSubmitError('Please enter a question.');
      return;
    }
    setSubmitError('');
    try {
      await dispatch(submitFAQ({ question: form.question })).unwrap();
      setSubmitted(true);
      setForm({ question: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit question.');
    }
  };

  return (
    <>
      <Helmet>
        <title>FAQ – FreelancePro</title>
        <meta name="description" content="Frequently asked questions about our services." />
      </Helmet>

      <main className="faq-page container" aria-labelledby="faq-heading">
        <h1 id="faq-heading">Frequently Asked Questions</h1>

        {/* Submission form */}
        <section className="faq-submit-section">
          <h2>Ask a Question</h2>
          {submitted && (
            <div className="success-message" role="status">
              Your question has been submitted. It will appear once approved.
            </div>
          )}
          {submitError && <div className="error-message" role="alert">{submitError}</div>}
          <form onSubmit={handleSubmit} className="faq-form">
            <textarea
              name="question"
              placeholder="Type your question here..."
              value={form.question}
              onChange={(e) => setForm({ question: e.target.value })}
              rows={3}
              required
            />
            <button type="submit">Submit Question</button>
          </form>
        </section>

        {/* Display approved FAQs */}
        <section className="faq-list">
          <h2>Approved Questions & Answers</h2>
          {isLoading && <div className="spinner" />}
          {error && <p className="error">Failed to load FAQs. Please try again.</p>}
          {!isLoading && !error && faqs.length === 0 && <p>No FAQs available yet.</p>}
          {!isLoading && !error && faqs.length > 0 && (
            <div className="faq-items">
              {faqs.map((faq) => (
                <div key={faq._id || faq.id} className="faq-item">
                  <h3>{faq.question}</h3>
                  {faq.answer && <p>{faq.answer}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default FAQPage;