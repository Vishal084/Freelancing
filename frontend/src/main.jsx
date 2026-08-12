import React from 'react';
import './config';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from '@sentry/react';
import { browserTracingIntegration } from '@sentry/react';
import { store } from './redux/store';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { SENTRY_DSN } from './config';
import { injectStore } from './services/api';
import './index.css';

injectStore(store);

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [browserTracingIntegration()],
    tracesSampleRate: 1.0,
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);


// . IMPORTS (What we're bringing in):

// React - The core React library

// HelmetProvider - For managing SEO meta tags

// ReactDOM - To render React into the browser

// Provider - Redux wrapper to share state across all components

// store : main purpose is State management - Your Redux store configuration , Your configured Redux store with all reducers (auth, services, projects, orders, about)

// App - Your main App component , App.jsx contains your entire application structure (Navbar, Routes, Footer)

// index.css - Global styles


// GLOBAL STORE EXPOSURE:

// javascript
// window.__REDUX_STORE__ = store
// Makes Redux store accessible globally

// Used by api.js interceptor to auto-logout on 401 errors

// : Redux store provider : <Provider store={store}>
    // Makes Redux store accessible to ALL components via useSelector/useDispatch
    // Without this, no component can access global state 


// ReactDOM.createRoot (finds <div id="root"> in index.html)
//     │
//     └──▶ React.StrictMode (development helper)
//          │
//          └──▶ Provider (Redux store wrapper)
//               │
//               └──▶ HelmetProvider (SEO wrapper)
//                    │
//                    └──▶ App (Your main component)




//  Execution Flow:
// Browser loads index.html

// Vite processes main.jsx

// React creates root at <div id="root">

// Redux store becomes available

// SEO provider initializes

// App component renders with full routing