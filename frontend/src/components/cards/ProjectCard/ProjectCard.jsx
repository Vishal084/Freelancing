
import './ProjectCard.css'

const ProjectCard = ({ project }) => {
  if (!project) return null // defensive
  return (
    <div className="project-card card">
      <img src={project.image} alt={project.title} loading="lazy" />
      <div className="project-info">
        <h3>{project.title}</h3>
        <span className="category">{project.category}</span>
        <p>{project.description}</p>
      </div>
    </div>
  )
}

export default ProjectCard



// Purpose: Reusable card to display a single portfolio project.
// Static data: None – it receives project as a prop. The data comes from Redux (projectSlice), which currently uses static projectsData.js.
// Improvements: Added loading="lazy" for images, defensive check for missing project.`