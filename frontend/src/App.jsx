import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/common/Navbar/Navbar';
import Footer from './components/common/Footer/Footer';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { verifyToken } from './redux/slices/authSlice';

function App() {
  console.log('VITE_API_URL is:', import.meta.env.VITE_API_URL);

  const dispatch = useDispatch();

  useEffect(() => {
    // Only verify if a token actually exists – prevents 401 loop on first load
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(verifyToken());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <AppRoutes />
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;