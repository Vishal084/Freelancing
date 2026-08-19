// frontend/src/components/common/Footer/Footer.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchSiteSettings,
  selectSiteSettings,
} from '../../../redux/slices/siteSettingsSlice';
import './Footer.css';

const Footer = () => {
  const dispatch = useDispatch();
  const siteSettings = useSelector(selectSiteSettings);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    dispatch(fetchSiteSettings());
  }, [dispatch]);

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
      { name: 'FAQ', href: '/faq' },
    ],
  };

  // Build social links array from backend data (same as Contact page)
  const socialLinks = [];
  if (siteSettings?.socialLinks) {
    const sl = siteSettings.socialLinks;
    if (sl.twitter) socialLinks.push({ name: 'twitter', url: sl.twitter, icon: '🐦' });
    if (sl.linkedin) socialLinks.push({ name: 'linkedin', url: sl.linkedin, icon: '💼' });
    if (sl.github) socialLinks.push({ name: 'github', url: sl.github, icon: '🐙' });
    if (sl.dribbble) socialLinks.push({ name: 'dribbble', url: sl.dribbble, icon: '🎨' });
    if (sl.instagram) socialLinks.push({ name: 'instagram', url: sl.instagram, icon: '📷' });
  }

  // Dynamic contact info with fallback
  const phone = siteSettings?.phone || '+1 (555) 123-4567';
  const email = siteSettings?.email || 'hello@websitewale24.com';
  const addressLine = siteSettings
    ? `${siteSettings.address}, ${siteSettings.city}, ${siteSettings.state} ${siteSettings.zip}`
    : '123 Tech Street, SF 94107';
  const workingHours = siteSettings?.workingHours || 'Mon-Fri 9am-6pm';

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-company">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">W</div>
              <div>
                <h2>Websitewale24.com</h2>
                <p>Digital Solutions</p>
              </div>
            </Link>
            <p className="footer-description">
              We create stunning digital experiences that help businesses thrive.
              From websites to mobile apps, we deliver excellence.
            </p>
            {/* Dynamic social links from backend */}
            <div className="footer-social">
              {socialLinks.map((platform) => (
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

          {/* Contact Info – now dynamic */}
          <div className="footer-contact">
            <h3>Contact Info</h3>
            <ul className="footer-contact-list">
              <li>📞 {phone}</li>
              <li>✉️ {email}</li>
              <li>📍 {addressLine}</li>
              <li>🕒 {workingHours}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {currentYear} Websitewale24.com. All rights reserved.</p>
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