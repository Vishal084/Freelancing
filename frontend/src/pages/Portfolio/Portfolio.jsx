// frontend/src/pages/Portfolio/Portfolio.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProjects,
  selectAllProjects,
  selectProjectsLoading,
  selectProjectsError,
} from '../../redux/slices/projectSlice';
import ProjectCard from '../../components/cards/ProjectCard/ProjectCard';
import './Portfolio.css';

const Portfolio = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectAllProjects);
  const isLoading = useSelector(selectProjectsLoading);
  const error = useSelector(selectProjectsError);

  const [retryTrigger, setRetryTrigger] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
    window.scrollTo(0, 0);
  }, [dispatch, retryTrigger]);

  const handleRetry = () => setRetryTrigger((prev) => !prev);

  return (
    <main className="container portfolio-page" aria-labelledby="portfolio-heading">
      <h1 id="portfolio-heading">Our Portfolio</h1>

      {/* Loading state */}
      {isLoading && (
        <div className="section-loading" role="status">
          <div className="spinner" aria-hidden="true"></div>
          <p>Loading projects...</p>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="section-error" role="alert">
          <p>⚠️ Failed to load projects. Please try again later.</p>
          <button onClick={handleRetry} className="btn btn-secondary">
            Retry
          </button>
        </div>
      )}

      {/* Normal state: projects found */}
      {!isLoading && !error && projects.length > 0 && (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Empty state: no projects in database */}
      {!isLoading && !error && projects.length === 0 && (
        <div className="section-empty">
          <p>No projects to display right now.</p>
          <p>
            Check back soon or{' '}
            <a href="/contact">get in touch</a> to discuss your project.
          </p>
        </div>
      )}
    </main>
  );
};

export default Portfolio;