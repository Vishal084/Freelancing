import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from '../redux/slices/dashboardSlice'; // we'll create one

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, isLoading, error } = useSelector(state => state.dashboard);

  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">Services <br/> {stats?.servicesCount}</div>
        <div className="stat-card">Projects <br/> {stats?.projectsCount}</div>
        <div className="stat-card">Orders <br/> {stats?.ordersCount}</div>
        <div className="stat-card">Contacts <br/> {stats?.contactsCount}</div>
        <div className="stat-card">Users <br/> {stats?.usersCount}</div>
      </div>
    </div>
  );
};
export default Dashboard;