import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import servicesReducer from './slices/servicesSlice';
import projectsReducer from './slices/projectsSlice';
import blogsReducer from './slices/blogsSlice';
import testimonialsReducer from './slices/testimonialsSlice';
import faqsReducer from './slices/faqsSlice';
import ordersReducer from './slices/ordersSlice';
import contactsReducer from './slices/contactsSlice';
import usersReducer from './slices/usersSlice';
import aboutReducer from './slices/aboutSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    services: servicesReducer,
    projects: projectsReducer,
    blogs: blogsReducer,
    testimonials: testimonialsReducer,
    faqs: faqsReducer,
    orders: ordersReducer,
    contacts: contactsReducer,
    users: usersReducer,
    about: aboutReducer,
  },
});