import api from './api';

const createRazorpayOrder = async (serviceId, details) => {
  const response = await api.post('/payment/create-order', { serviceId, details });
  return response.data;
};

const verifyPayment = async (verificationData) => {
  const response = await api.post('/payment/verify', verificationData);
  return response.data;
};

export default { createRazorpayOrder, verifyPayment };
