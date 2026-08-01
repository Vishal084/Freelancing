import { Link } from 'react-router-dom';

const Placeholder = ({ title }) => (
  <main className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
    <h1>{title || 'Coming Soon'}</h1>
    <p>This page is under construction. Check back later!</p>
    <Link to="/" className="btn btn-primary">Go Home</Link>
  </main>
);

export default Placeholder;