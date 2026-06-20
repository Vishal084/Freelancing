// frontend/src/pages/Home/Home.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // <-- added
import {
  fetchServices,
  selectAllServices,
  selectServicesLoading,
  selectServicesError,
} from '../../redux/slices/serviceSlice';
import {
  fetchProjects,
  selectAllProjects,
  selectProjectsLoading,
  selectProjectsError,
} from '../../redux/slices/projectSlice';
import ServiceCard from '../../components/cards/ServiceCard/ServiceCard';
import ProjectCard from '../../components/cards/ProjectCard/ProjectCard';
import './Home.css';

const Home = () => {
  
  const dispatch = useDispatch();

  const services = useSelector(selectAllServices);
  const servicesLoading = useSelector(selectServicesLoading);
  const servicesError = useSelector(selectServicesError);

  const projects = useSelector(selectAllProjects);
  const projectsLoading = useSelector(selectProjectsLoading);
  const projectsError = useSelector(selectProjectsError);

  // Retry triggers (local state) to re‑fetch when the user clicks “Retry”
  const [retryServices, setRetryServices] = useState(false);
  const [retryProjects, setRetryProjects] = useState(false);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch, retryServices]);

  useEffect(() => {
    dispatch(fetchProjects());
    window.scrollTo(0, 0);
  }, [dispatch, retryProjects]);

  // Image fallback – if the Unsplash image fails AND the local fallback fails,
  // we show a coloured placeholder to avoid a broken image altogether.
  const handleImageError = (e) => {
    if (e.target.src.includes('/images/hero-fallback.jpg')) {
      // Prevent further attempts
      e.target.onerror = null;
      // Inline SVG or a simple div placeholder is better – using a data URI
      e.target.src =
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect fill="%234f46e5" width="600" height="400"/%3E%3Ctext fill="white" font-family="sans-serif" font-size="24" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EDigital Solutions%3C/text%3E%3C/svg%3E';
      return;
    }
    // First failure → try local fallback
    e.target.src = '/images/hero-fallback.jpg';
  };

  const retryServicesHandler = () => setRetryServices((prev) => !prev);
  const retryProjectsHandler = () => setRetryProjects((prev) => !prev);

  return (
    <>
      {/* SEO & Meta Tags */}
      <Helmet>
        <title>FreelancePro – Build Your Digital Future</title>
        <meta 
          name="description" 
          content="We create stunning websites, scalable web apps, and modern digital solutions. Trusted by 100+ companies. Get your project started today." 
        />
        <meta property="og:title" content="FreelancePro – Digital Solutions" />
        <meta property="og:description" content="We deliver exceptional websites, web apps, and mobile apps to grow your business." />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="home">
        {/* ========== HERO SECTION ========== */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-bg-overlay" aria-hidden="true"></div>
          <div className="hero-bg-blob hero-blob-1" aria-hidden="true"></div>
          <div className="hero-bg-blob hero-blob-2" aria-hidden="true"></div>

          <div className="container hero-container">
            <div className="hero-grid">
              <div className="hero-content">
                <div className="trust-badge">
                  <span className="trust-icon" aria-hidden="true">✨</span>
                  <span>Trusted by 100+ Companies</span>
                </div>

                <h1 id="hero-heading" className="hero-title">
                  <span className="hero-title-line">Build Your</span>
                  <span className="hero-title-gradient">Digital Future</span>
                </h1>

                <p className="hero-description">
                  We create stunning websites, scalable web apps, and modern digital solutions.
                </p>

                <div className="hero-buttons">
                  <Link to="/contact" className="btn btn-primary">
                    Start Project <span aria-hidden="true">→</span>
                  </Link>
                  <Link to="/portfolio" className="btn btn-secondary">
                    ⚡ View Portfolio
                  </Link>
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon" aria-hidden="true">🏆</div>
                    <div className="stat-value">150+</div>
                    <div className="stat-label">Projects</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" aria-hidden="true">👥</div>
                    <div className="stat-value">98%</div>
                    <div className="stat-label">Clients</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" aria-hidden="true">⭐</div>
                    <div className="stat-value">50+</div>
                    <div className="stat-label">Awards</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" aria-hidden="true">⏰</div>
                    <div className="stat-value">24/7</div>
                    <div className="stat-label">Support</div>
                  </div>
                </div>
              </div>

              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3"
                  alt="Abstract digital illustration representing our software development and design work"
                  loading="lazy"
                  onError={handleImageError}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========== SERVICES SECTION ========== */}
        <section id="services" className="services-section" aria-labelledby="services-heading">
          <div className="container">
            <div className="section-header">
              <h2 id="services-heading">Our Services</h2>
              <p>Comprehensive digital solutions tailored to your business needs</p>
            </div>

            {/* Loading */}
            {servicesLoading && (
              <div className="section-loading" role="status">
                <div className="spinner" aria-hidden="true"></div>
                <p>Loading services...</p>
              </div>
            )}

            {/* Error + Retry */}
            {!servicesLoading && servicesError && (
              <div className="section-error" role="alert">
                <p>⚠️ Failed to load services. Please try again later.</p>
                <button onClick={retryServicesHandler} className="btn btn-secondary">
                  Retry
                </button>
              </div>
            )}

            {/* Normal grid */}
            {!servicesLoading && !servicesError && services.length > 0 && (
              <>
                <div className="services-grid">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
                <div className="section-cta">
                  <Link to="/services" className="btn btn-outline">
                    View All Services →
                  </Link>
                </div>
              </>
            )}

            {/* Empty state (no services in DB) */}
            {!servicesLoading && !servicesError && services.length === 0 && (
              <div className="section-empty">
                <p>No services available at the moment. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* ========== FEATURED PROJECTS ========== */}
        <section id="portfolio" className="projects-section" aria-labelledby="projects-heading">
          <div className="container">
            <div className="section-header">
              <h2 id="projects-heading">Featured Projects</h2>
              <p>Showcasing our best work and successful projects</p>
            </div>

            {/* Loading */}
            {projectsLoading && (
              <div className="section-loading" role="status">
                <div className="spinner" aria-hidden="true"></div>
                <p>Loading projects...</p>
              </div>
            )}

            {/* Error + Retry */}
            {!projectsLoading && projectsError && (
              <div className="section-error" role="alert">
                <p>⚠️ Failed to load projects. Please try again later.</p>
                <button onClick={retryProjectsHandler} className="btn btn-secondary">
                  Retry
                </button>
              </div>
            )}

            {/* Normal: show first 3 */}
            {!projectsLoading && !projectsError && projects.length > 0 && (
              <>
                <div className="projects-grid">
                  {projects.slice(0, 3).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
                <div className="section-cta">
                  <Link to="/portfolio" className="btn btn-outline">
                    See Full Portfolio →
                  </Link>
                </div>
              </>
            )}

            {/* Empty state */}
            {!projectsLoading && !projectsError && projects.length === 0 && (
              <div className="section-empty">
                <p>No projects to showcase right now. Come back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* ========== CTA SECTION ========== */}
        <section className="cta-section" aria-labelledby="cta-heading">
          <div className="container cta-container">
            <h2 id="cta-heading">Ready to Grow Your Business?</h2>
            <p>Let's build something amazing together.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-cta-primary">
                Get Started Today
              </Link>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-cta-secondary"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;