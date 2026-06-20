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