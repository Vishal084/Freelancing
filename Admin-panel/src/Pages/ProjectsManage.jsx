import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, addProject, editProject, removeProject } from '../redux/slices/projectsSlice';

const ProjectsManage = () => {
  const dispatch = useDispatch();
  const { list, isLoading } = useSelector(state => state.projects);
  const [form, setForm] = useState({ title: '', category: '', description: '', image: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      dispatch(editProject({ id: editId, data: form }));
    } else {
      dispatch(addProject(form));
    }
    setForm({ title: '', category: '', description: '', image: '' });
    setEditId(null);
  };

  const handleEdit = (project) => {
    setForm({ title: project.title, category: project.category, description: project.description, image: project.image });
    setEditId(project.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this project?')) dispatch(removeProject(id));
  };

  return (
    <div>
      <h2>Projects Management</h2>
      <form onSubmit={handleSubmit} className="crud-form">
        <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
        <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
        <input placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required />
        <button type="submit">{editId ? 'Update' : 'Add'} Project</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: '', category: '', description: '', image: '' }); }}>Cancel</button>}
      </form>

      {isLoading ? <p>Loading...</p> : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(project => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{project.category}</td>
                <td><img src={project.image} alt={project.title} height="50" /></td>
                <td>
                  <button onClick={() => handleEdit(project)}>Edit</button>
                  <button onClick={() => handleDelete(project.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProjectsManage;