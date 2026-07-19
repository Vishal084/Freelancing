import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, changeOrderStatus, deleteOrder } from '../redux/slices/ordersSlice';

const OrdersManage = () => {
  const dispatch = useDispatch();
  const { list, isLoading } = useSelector(state => state.orders);
  useEffect(() => { dispatch(fetchAllOrders()); }, [dispatch]);

  const statusOptions = ['pending', 'confirmed', 'in progress', 'completed', 'cancelled'];

  const handleStatusChange = (id, newStatus) => {
    dispatch(changeOrderStatus({ id, status: newStatus }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this order?')) dispatch(deleteOrder(id));
  };

  if (isLoading) return <p>Loading orders...</p>;

  return (
    <div>
      <h2>Orders Management</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Service</th>
            <th>Details</th>
            <th>Price</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map(order => (
            <tr key={order._id}>
              <td>{order.userId?.name || 'N/A'}</td>
              <td>{order.serviceName}</td>
              <td>{order.details.slice(0, 40)}...</td>
              <td>${order.price}</td>
              <td>
                <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)}>
                  {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDelete(order._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default OrdersManage;