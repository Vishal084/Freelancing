import api from './api';

// Auth
export const login = (data) => api.post('/auth/login', data).then(res => res.data);
export const getMe = () => api.get('/auth/me').then(res => res.data);

// Dashboard
export const getDashboard = () => api.get('/admin/dashboard').then(res => res.data);

// Services
export const getServices = () => api.get('/services').then(res => res.data);
export const createService = (data) => api.post('/admin/services', data).then(res => res.data);
export const updateService = (id, data) => api.put(`/admin/services/${id}`, data).then(res => res.data);
export const deleteService = (id) => api.delete(`/admin/services/${id}`).then(res => res.data);

// Projects
export const getProjects = () => api.get('/projects').then(res => res.data);
export const createProject = (data) => api.post('/admin/projects', data).then(res => res.data);
export const updateProject = (id, data) => api.put(`/admin/projects/${id}`, data).then(res => res.data);
export const deleteProject = (id) => api.delete(`/admin/projects/${id}`).then(res => res.data);

// About
export const getAbout = () => api.get('/about').then(res => res.data);
export const updateAbout = (data) => api.put('/admin/about', data).then(res => res.data);

// Orders
export const getAllOrders = () => api.get('/admin/orders').then(res => res.data);
export const updateOrderStatus = (id, status) => api.put(`/admin/orders/${id}/status`, { status }).then(res => res.data);
export const deleteOrder = (id) => api.delete(`/admin/orders/${id}`).then(res => res.data);

// Contacts
export const getContacts = () => api.get('/admin/contacts').then(res => res.data);
export const deleteContact = (id) => api.delete(`/admin/contacts/${id}`).then(res => res.data);

// Users
export const getUsers = () => api.get('/admin/users').then(res => res.data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`).then(res => res.data);
export const toggleBan = (id) => api.put(`/admin/users/${id}/ban`).then(res => res.data);
export const toggleAdmin = (id) => api.put(`/admin/users/${id}/admin`).then(res => res.data);

// Blogs
export const getBlogs = () => api.get('/admin/blogs').then(res => res.data);
export const createBlog = (data) => api.post('/admin/blogs', data).then(res => res.data);
export const updateBlog = (id, data) => api.put(`/admin/blogs/${id}`, data).then(res => res.data);
export const deleteBlog = (id) => api.delete(`/admin/blogs/${id}`).then(res => res.data);

// Testimonials
export const getTestimonials = () => api.get('/admin/testimonials').then(res => res.data);
export const createTestimonial = (data) => api.post('/admin/testimonials', data).then(res => res.data);
export const updateTestimonial = (id, data) => api.put(`/admin/testimonials/${id}`, data).then(res => res.data);
export const deleteTestimonial = (id) => api.delete(`/admin/testimonials/${id}`).then(res => res.data);

// FAQs
export const getFAQs = () => api.get('/admin/faqs').then(res => res.data);
export const createFAQ = (data) => api.post('/admin/faqs', data).then(res => res.data);
export const updateFAQ = (id, data) => api.put(`/admin/faqs/${id}`, data).then(res => res.data);
export const deleteFAQ = (id) => api.delete(`/admin/faqs/${id}`).then(res => res.data);