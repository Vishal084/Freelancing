// frontend/src/pages/About/About.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchAboutData, selectAboutData, selectAboutLoading, selectAboutError } from '../../redux/slices/aboutSlice';
import './About.css';

const AboutPage = () => {
  const dispatch = useDispatch();
  const aboutData = useSelector(selectAboutData);
  const loading = useSelector(selectAboutLoading);
  const error = useSelector(selectAboutError);

  useEffect(() => {
    dispatch(fetchAboutData());
    window.scrollTo(0, 0);
  }, [dispatch]);

  // Image fallback handler (same logic as before)
  const handleImageError = (e) => {
    if (e.target.src.includes('/images/fallback-person.jpg')) {
      e.target.onerror = null;
      e.target.src =
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%234f46e5" width="200" height="200"/%3E%3Ctext fill="white" font-family="sans-serif" font-size="18" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ETeam Member%3C/text%3E%3C/svg%3E';
      return;
    }
    e.target.src = '/images/fallback-person.jpg';
  };

  // Loading state
  if (loading) {
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
  if (error) {
    return (
      <main className="container" role="alert">
        <div className="section-error">
          <p>⚠️ {error}</p>
        </div>
      </main>
    );
  }

  // No data yet
  if (!aboutData) {
    return (
      <main className="container">
        <p>No about information available.</p>
      </main>
    );
  }

  const { coreValues, teamMembers, milestones } = aboutData;

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
                <a href="#story" className="btn btn-primary">
                  Our Story →
                </a>
                <a href="#team" className="btn btn-secondary">
                  Meet Our Team 👥
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ======== MISSION & VISION (static) ======== */}
        <section id="story" className="about-mission-vision" aria-labelledby="mv-heading">
          <div className="container">
            <h2 id="mv-heading" className="sr-only">Mission & Vision</h2>
            <div className="about-mv-grid">
              <div className="about-mv-card mission-card">
                <div className="about-mv-icon mission-icon">
                  <span className="icon" aria-hidden="true">🎯</span>
                </div>
                <h2>Our Mission</h2>
                <p>
                  To empower businesses with innovative digital solutions that enhance their online presence,
                  streamline operations, and accelerate growth in the ever-evolving digital landscape.
                </p>
                <ul className="about-mv-list">
                  <li>✅ Deliver exceptional value</li>
                  <li>✅ Foster innovation</li>
                  <li>✅ Build lasting partnerships</li>
                  <li>✅ Drive measurable results</li>
                </ul>
              </div>

              <div className="about-mv-card vision-card">
                <div className="about-mv-icon vision-icon">
                  <span className="icon" aria-hidden="true">👁️</span>
                </div>
                <h2>Our Vision</h2>
                <p>
                  To become the most trusted digital partner for businesses worldwide, recognized for our
                  technical excellence, creative innovation, and unwavering commitment to client success.
                </p>
                <div className="about-vision-points">
                  <div className="vision-point">
                    <span className="point-icon" aria-hidden="true">🌍</span>
                    <div>
                      <h4>Global Impact</h4>
                      <p>Expanding our reach to serve clients across continents</p>
                    </div>
                  </div>
                  <div className="vision-point">
                    <span className="point-icon" aria-hidden="true">📈</span>
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

        {/* ======== STATS (static) ======== */}
        <section className="about-stats" aria-labelledby="stats-heading">
          <div className="container">
            <div className="section-header">
              <h2 id="stats-heading">Our Journey in Numbers</h2>
              <p>Years of dedication, countless projects, and many satisfied clients</p>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon" aria-hidden="true">📅</div>
                <div className="stat-number">5+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon" aria-hidden="true">🏆</div>
                <div className="stat-number">150+</div>
                <div className="stat-label">Projects Delivered</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon" aria-hidden="true">👥</div>
                <div className="stat-number">98%</div>
                <div className="stat-label">Happy Clients</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon" aria-hidden="true">🌍</div>
                <div className="stat-number">15+</div>
                <div className="stat-label">Countries Served</div>
              </div>
            </div>
          </div>
        </section>

        {/* ======== CORE VALUES (dynamic from Redux) ======== */}
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

        {/* ======== CTA (static) ======== */}
        <section className="about-cta" aria-labelledby="cta-heading">
          <div className="container about-cta-container">
            <h2 id="cta-heading">Ready to Work With Us?</h2>
            <p>Let&apos;s build something amazing together. Our team is ready to bring your vision to life.</p>
            <div className="about-cta-buttons">
              <Link to="/contact" className="btn btn-cta-primary">
                Start a Project
              </Link>
              <Link to="/portfolio" className="btn btn-cta-secondary">
                View Our Work
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AboutPage;