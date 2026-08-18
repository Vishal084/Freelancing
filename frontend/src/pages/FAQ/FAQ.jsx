import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
  fetchPublicFAQs,
  submitFAQ,
  selectFAQs,
  selectFAQLoading,
  selectFAQError,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track which FAQ item is open (by id)
  const [openId, setOpenId] = useState(null);

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
    setIsSubmitting(true);
    try {
      await dispatch(submitFAQ({ question: form.question })).unwrap();
      setSubmitted(true);
      setForm({ question: '' });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit question.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFAQ = (id) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  return (
    <>
      <Helmet>
        <title>FAQ – FreelancePro</title>
        <meta name="description" content="Frequently asked questions about our services." />
      </Helmet>

      <main className="faq-page container" aria-labelledby="faq-heading">
        <h1 id="faq-heading">Frequently Asked Questions</h1>

        <section className="faq-submit-section" aria-label="Ask a question">
          <h2>Ask a Question</h2>
          {submitted && (
            <div className="success-message" role="status">
              ✅ Your question has been submitted and is awaiting admin approval.
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
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Question'}
            </button>
          </form>
        </section>

        <section className="faq-list" aria-label="FAQ list">
          <h2>Questions &amp; Answers</h2>

          {isLoading && (
            <div className="faq-loading" role="status">
              <div className="spinner" aria-hidden="true"></div>
              <p>Loading FAQs...</p>
            </div>
          )}

          {error && (
            <div className="faq-error" role="alert">
              <p>⚠️ {error}</p>
              <button onClick={() => dispatch(fetchPublicFAQs())} className="btn btn-secondary">
                Retry
              </button>
            </div>
          )}

          {!isLoading && !error && faqs.length === 0 && (
            <p>No FAQs available yet.</p>
          )}

          {!isLoading && !error && faqs.length > 0 && (
            <div className="faq-accordion">
              {faqs.map((faq) => {
                const isOpen = openId === (faq._id || faq.id);
                return (
                  <div key={faq._id || faq.id} className="faq-item">
                    <button
                      className="faq-question"
                      onClick={() => toggleFAQ(faq._id || faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq._id || faq.id}`}
                    >
                      <span>{faq.question}</span>
                      <span className={`faq-icon ${isOpen ? 'open' : ''}`} aria-hidden="true">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div
                        id={`faq-answer-${faq._id || faq.id}`}
                        className="faq-answer"
                        role="region"
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default FAQPage;