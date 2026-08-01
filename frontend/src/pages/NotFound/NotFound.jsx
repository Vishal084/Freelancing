// frontend/src/pages/NotFound/NotFound.jsx
import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
    <h1>404 – Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn btn-primary">Go Home</Link>
  </main>
);

export default NotFound;