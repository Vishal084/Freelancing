// frontend/src/components/common/Footer/Footer.jsx
import { Link } from 'react-router-dom';
import { SOCIAL_LINKS } from '../../../utils/constants'; // added
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Services: [
      { name: 'Website Development', href: '/services#web' },
      { name: 'Web App Development', href: '/services#web-app' },
      { name: 'Mobile App Development', href: '/services#mobile' },
      { name: 'Maintenance & Support', href: '/services#maintenance' },
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Portfolio', href: '/portfolio' },
      { name: 'Testimonials', href: '/about#testimonials' },
      { name: 'Careers', href: '/careers' },
    ],
    Resources: [
      { name: 'Blog', href: '/blog' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Support', href: '/support' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-company">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">F</div>
              <div>
                <h2>FreelancePro</h2>
                <p>Digital Solutions</p>
              </div>
            </Link>
            <p className="footer-description">
              We create stunning digital experiences that help businesses thrive.
              From websites to mobile apps, we deliver excellence.
            </p>
            {/* Social links now come from constants */}
            <div className="footer-social">
              {SOCIAL_LINKS.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`footer-social-icon footer-social-${platform.name}`}
                  aria-label={platform.name}
                >
                  {platform.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="footer-links">
              <h3>{category}</h3>
              <ul>
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="footer-contact">
            <h3>Contact Info</h3>
            <ul className="footer-contact-list">
              <li>📞 +1 (555) 123-4567</li>
              <li>✉️ hello@freelancepro.com</li>
              <li>📍 123 Tech Street, SF 94107</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {currentYear} FreelancePro. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;