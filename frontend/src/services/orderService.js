import api from './api';

const placeOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

const getUserOrders = async () => {
  const response = await api.get('/orders/user/me');
  return response.data;
};

const cancelOrder = async (orderId) => {
  const response = await api.patch(`/orders/${orderId}/cancel`);
  return response.data;
};

export default { placeOrder, getUserOrders, cancelOrder };