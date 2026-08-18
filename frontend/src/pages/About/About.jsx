import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  fetchAboutData,
  selectAboutData,
  selectAboutLoading,
  selectAboutError,
} from '../../redux/slices/aboutSlice';
import {
  fetchTestimonials,
  submitTestimonial,
  selectTestimonials,
  selectTestimonialsLoading,
  selectTestimonialsError,
} from '../../redux/slices/testimonialSlice';
import './About.css';

const AboutPage = () => {
  const dispatch = useDispatch();
  const aboutData = useSelector(selectAboutData);
  const aboutLoading = useSelector(selectAboutLoading);
  const aboutError = useSelector(selectAboutError);

  const testimonials = useSelector(selectTestimonials);
  const testimonialsLoading = useSelector(selectTestimonialsLoading);
  const testimonialsError = useSelector(selectTestimonialsError);

  // ---- Testimonial submission form state ----
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    quote: '',
    role: '',
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ---- Testimonial carousel state ----
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch only when data is missing
  useEffect(() => {
    if (!aboutData) dispatch(fetchAboutData());
    if (testimonials.length === 0) dispatch(fetchTestimonials());
    window.scrollTo(0, 0);
  }, [dispatch, aboutData, testimonials.length]);

  // Image fallback handler
  const handleImageError = (e) => {
    if (e.target.src.includes('/images/fallback-person.jpg')) {
      e.target.onerror = null;
      e.target.src =
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%234f46e5" width="200" height="200"/%3E%3Ctext fill="white" font-family="sans-serif" font-size="18" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ETeam Member%3C/text%3E%3C/svg%3E';
      return;
    }
    e.target.src = '/images/fallback-person.jpg';
  };

  // ---- Handle testimonial submission ----
  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    try {
      await dispatch(submitTestimonial(testimonialForm)).unwrap();
      setTestimonialForm({ name: '', quote: '', role: '' });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
      dispatch(fetchTestimonials());
    } catch (err) {
      setSubmitError(err || 'Failed to submit testimonial. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestimonialChange = (e) => {
    setTestimonialForm({ ...testimonialForm, [e.target.name]: e.target.value });
  };

  // ---- Fallback testimonials (if no approved testimonials) ----
  const fallbackTestimonials = [
    {
      quote: 'They delivered our project ahead of schedule with outstanding quality.',
      name: 'Jane Doe',
      company: 'TechCorp',
    },
    {
      quote: 'Professional, responsive, and highly skilled. Highly recommended!',
      name: 'John Smith',
      company: 'StartupXYZ',
    },
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  // ---- Carousel auto-advance every 5 seconds ----
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayTestimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displayTestimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? displayTestimonials.length - 1 : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Loading state
  if (aboutLoading) {
    return (
      <main className="container" role="status">
        <div className="section-loading">
          <div className="spinner" aria-hidden="true"></div>
          <p>Loading about page...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (aboutError) {
    return (
      <main className="container" role="alert">
        <div className="section-error">
          <p>⚠️ {aboutError}</p>
          <button onClick={() => dispatch(fetchAboutData())} className="btn btn-secondary">
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!aboutData) {
    return (
      <main className="container">
        <p>No about information available.</p>
      </main>
    );
  }

  const coreValues = aboutData?.coreValues ?? [];
  const teamMembers = aboutData?.teamMembers ?? [];
  const milestones = aboutData?.milestones ?? [];
  const stats = aboutData?.stats ?? [
    { icon: '📅', value: '5+', label: 'Years Experience' },
    { icon: '🏆', value: '150+', label: 'Projects Delivered' },
    { icon: '👥', value: '98%', label: 'Happy Clients' },
    { icon: '🌍', value: '15+', label: 'Countries Served' },
  ];

  return (
    <>
      <Helmet>
        <title>About Us – FreelancePro</title>
        <meta name="description" content="Learn about our mission, vision, team, and the values that drive our digital solutions." />
      </Helmet>

      <main className="about-page" aria-labelledby="about-heading">
        {/* ======== HERO (static) ======== */}
        <section className="about-hero" aria-labelledby="hero-title">
          <div className="about-hero-bg" aria-hidden="true"></div>
          <div className="container about-hero-container">
            <div className="about-hero-content">
              <h1 id="hero-title" className="about-hero-title">
                Building Digital <span className="gradient-text">Excellence</span>
              </h1>
              <p className="about-hero-description">
                We&apos;re a passionate team of developers, designers, and strategists dedicated to creating
                exceptional digital experiences that drive business growth.
              </p>
              <div className="about-hero-buttons">
                <a href="#story" className="btn btn-primary">Our Story →</a>
                <a href="#team" className="btn btn-secondary">Meet Our Team 👥</a>
              </div>
            </div>
          </div>
        </section>

        {/* ======== MISSION & VISION (dynamic) ======== */}
        <section id="story" className="about-mission-vision" aria-labelledby="mv-heading">
          <div className="container">
            <div className="about-mv-grid">
              <div className="about-mv-card mission-card">
                <div className="about-mv-icon mission-icon">🎯</div>
                <h2>Our Mission</h2>
                <p>{aboutData.mission || 'To empower businesses...'}</p>
                <ul className="about-mv-list">
                  <li>✅ Deliver exceptional value</li>
                  <li>✅ Foster innovation</li>
                  <li>✅ Build lasting partnerships</li>
                  <li>✅ Drive measurable results</li>
                </ul>
              </div>

              <div className="about-mv-card vision-card">
                <div className="about-mv-icon vision-icon">👁️</div>
                <h2>Our Vision</h2>
                <p>{aboutData.vision || 'To become the most trusted...'}</p>
                <div className="about-vision-points">
                  <div className="vision-point">
                    <span className="point-icon">🌍</span>
                    <div>
                      <h4>Global Impact</h4>
                      <p>Expanding our reach to serve clients across continents</p>
                    </div>
                  </div>
                  <div className="vision-point">
                    <span className="point-icon">📈</span>
                    <div>
                      <h4>Continuous Growth</h4>
                      <p>Constantly evolving with technology and market trends</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======== STATS (dynamic) ======== */}
        <section className="about-stats" aria-labelledby="stats-heading">
          <div className="container">
            <div className="section-header">
              <h2 id="stats-heading">Our Journey in Numbers</h2>
              <p>Years of dedication, countless projects, and many satisfied clients</p>
            </div>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-icon" aria-hidden="true">{stat.icon}</div>
                  <div className="stat-number">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======== CORE VALUES (dynamic) ======== */}
        <section className="about-values" aria-labelledby="values-heading">
          <div className="container">
            <div className="section-header">
              <h2 id="values-heading">Our Core Values</h2>
              <p>The principles that guide our work and define our culture</p>
            </div>
            <div className="values-grid">
              {coreValues.map((value, index) => (
                <div key={index} className={`value-card value-${value.color}`}>
                  <div className="value-icon" aria-hidden="true">{value.icon}</div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======== TIMELINE / MILESTONES (dynamic) ======== */}
        <section className="about-timeline" aria-labelledby="timeline-heading">
          <div className="container">
            <div className="section-header">
              <h2 id="timeline-heading">Our Journey</h2>
              <p>Key milestones that shaped our growth and success</p>
            </div>
            <div className="timeline">
              <div className="timeline-line" aria-hidden="true"></div>
              {milestones.map((milestone, index) => (
                <div key={index} className={`timeline-item ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'}`}>
                  <div className="timeline-dot" aria-hidden="true"></div>
                  <div className="timeline-content">
                    <div className="timeline-year">{milestone.year}</div>
                    <h3>{milestone.event}</h3>
                    <p>{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======== TEAM SECTION (dynamic) ======== */}
        <section id="team" className="about-team" aria-labelledby="team-heading">
          <div className="container">
            <div className="section-header">
              <h2 id="team-heading">Meet Our Team</h2>
              <p>The talented individuals who bring our vision to life</p>
            </div>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-card">
                  <div className="team-image">
                    <img
                      src={member.image}
                      alt={`Photo of ${member.name}`}
                      loading="lazy"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="team-info">
                    <h3>{member.name}</h3>
                    <p className="team-role">{member.role}</p>
                    <p className="team-bio">{member.bio}</p>
                    <div className="team-expertise">
                      <h4>Expertise</h4>
                      <div className="expertise-tags">
                        {member.expertise.map((skill, idx) => (
                          <span key={idx} className="tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======== TESTIMONIALS (dynamic with carousel) ======== */}
        <section id="testimonials" className="about-testimonials" aria-labelledby="testimonials-heading">
          <div className="container">
            <div className="section-header">
              <h2 id="testimonials-heading">What Our Clients Say</h2>
              <p>Trusted by businesses worldwide</p>
            </div>

            {/* Testimonial submission form */}
            <div className="testimonial-submit">
              <h3>Share Your Experience</h3>
              {submitSuccess && (
                <div className="success-message" role="status">
                  ✅ Thank you for your testimonial! It will appear once approved.
                </div>
              )}
              {submitError && (
                <div className="error-message" role="alert">
                  {submitError}
                </div>
              )}
              <form onSubmit={handleTestimonialSubmit} className="testimonial-form">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  value={testimonialForm.name}
                  onChange={handleTestimonialChange}
                  required
                />
                <textarea
                  name="quote"
                  placeholder="Your Feedback *"
                  value={testimonialForm.quote}
                  onChange={handleTestimonialChange}
                  required
                  rows={3}
                />
                <input
                  type="text"
                  name="role"
                  placeholder="Your Role/Company (optional)"
                  value={testimonialForm.role}
                  onChange={handleTestimonialChange}
                />
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Testimonial'}
                </button>
              </form>
            </div>

            {testimonialsLoading && (
              <div className="section-loading" role="status">
                <div className="spinner" aria-hidden="true"></div>
                <p>Loading testimonials...</p>
              </div>
            )}

            {testimonialsError && (
              <div className="section-error" role="alert">
                <p>⚠️ Could not load testimonials. Showing highlights instead.</p>
                <button onClick={() => dispatch(fetchTestimonials())} className="btn btn-secondary">
                  Retry
                </button>
              </div>
            )}

            {/* Carousel */}
            {displayTestimonials.length > 0 && (
              <div className="testimonial-carousel">
                <div className="testimonial-slide">
                  <p className="testimonial-text">“{displayTestimonials[currentSlide].quote}”</p>
                  <div className="testimonial-author">
                    <strong>{displayTestimonials[currentSlide].name}</strong>
                    {displayTestimonials[currentSlide].company || displayTestimonials[currentSlide].role
                      ? `, ${displayTestimonials[currentSlide].company || displayTestimonials[currentSlide].role}`
                      : ''}
                  </div>
                </div>

                <div className="testimonial-controls">
                  <button className="testimonial-arrow" onClick={prevSlide} aria-label="Previous testimonial">
                    ‹
                  </button>
                  <div className="testimonial-dots">
                    {displayTestimonials.map((_, i) => (
                      <button
                        key={i}
                        className={`testimonial-dot ${i === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(i)}
                        aria-label={`Go to testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button className="testimonial-arrow" onClick={nextSlide} aria-label="Next testimonial">
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ======== CTA (static) ======== */}
        <section className="about-cta" aria-labelledby="cta-heading">
          <div className="container about-cta-container">
            <h2 id="cta-heading">Ready to Work With Us?</h2>
            <p>Let&apos;s build something amazing together. Our team is ready to bring your vision to life.</p>
            <div className="about-cta-buttons">
              <Link to="/contact" className="btn btn-cta-primary">Start a Project</Link>
              <Link to="/portfolio" className="btn btn-cta-secondary">View Our Work</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AboutPage;