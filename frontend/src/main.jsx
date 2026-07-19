import React from 'react'
import { HelmetProvider } from 'react-helmet-async';

import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import App from './App'
import './index.css'

// Expose store for API interceptor  , its GLOBAL STORE EXPOSURE: Makes Redux store accessible globallyUsed by api.js interceptor to auto-logout on 401 errors

window.__REDUX_STORE__ = store;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
            <HelmetProvider>

      <App />
            </HelmetProvider>

    </Provider>
  </React.StrictMode>
)


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