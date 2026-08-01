import { Link } from 'react-router-dom';
import './FloatingCTA.css';

const FloatingCTA = () => (
  <Link to="/contact" className="floating-cta" aria-label="Get a Quote">
    ✉️
  </Link>
);

export default FloatingCTA;