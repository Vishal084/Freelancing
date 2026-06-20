import React from 'react'
import { HelmetProvider } from 'react-helmet-async';

import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import App from './App'
import './index.css'

// Expose store for API interceptor
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
