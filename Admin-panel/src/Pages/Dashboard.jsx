// admin-panel/src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from '../redux/slices/dashboardSlice';
import StatCard from '../components/StatCard'; // new reusable component

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, isLoading, error } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (isLoading) return <div className="dashboard"><p>Loading dashboard...</p></div>;
  if (error) return <div className="dashboard"><p className="error">Error: {error}</p></div>;

  // Support both old (servicesCount, projectsCount) and new (totalRevenue, ongoingProjects) API responses
  const totalRevenue = stats?.totalRevenue ?? 0;
  const ongoingProjects = stats?.ongoingProjects ?? stats?.projectsCount ?? 0;
  const completedProjects = stats?.completedProjects ?? 0;
  const upcomingProjects = stats?.upcomingProjects ?? 0;
  const totalUsers = stats?.usersCount ?? 0;
  const pendingTestimonials = stats?.pendingTestimonials ?? 0;
  const pendingFAQs = stats?.pendingFAQs ?? 0;

  return (
    <div className="dashboard">
      <h2>Business Overview</h2>
      <div className="stats-grid">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} />
        <StatCard title="Ongoing Projects" value={ongoingProjects} />
        <StatCard title="Completed Projects" value={completedProjects} />
        <StatCard title="Upcoming Projects" value={upcomingProjects} />
        <StatCard title="Total Users" value={totalUsers} />
        <StatCard title="Pending Testimonials" value={pendingTestimonials} />
        <StatCard title="Pending FAQs" value={pendingFAQs} />
      </div>
    </div>
  );
};

export default Dashboard;