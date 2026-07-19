import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import serviceReducer from './slices/serviceSlice'
import orderReducer from './slices/orderSlice'
import projectReducer from './slices/projectSlice'
import aboutReducer from './slices/aboutSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    orders: orderReducer,
    projects: projectReducer,
    about: aboutReducer,   // new

  },
})




// configureStore  - Creates Redux store with good defaults (combines reducers, sets up DevTools, adds middleware)
// authReducer     - Manages authentication state (user, token, loading, error)
// serviceReducer  - Manages services data (list of services, loading, error)
// orderReducer    - Manages orders data (user orders, loading, error, lastOrder)
// projectReducer  - Manages projects data (list of projects, loading, error)
// aboutReducer    - Manages about page data (company info, team, milestones, loading, error)