import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAbout, updateAbout } from '../redux/slices/aboutSlice';  // ← changed saveAbout → updateAbout

const AboutEdit = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(state => state.about);
  const [form, setForm] = useState({
    mission: '',
    vision: '',
    coreValues: [],
    teamMembers: [],
    milestones: []
  });

  useEffect(() => { dispatch(fetchAbout()); }, [dispatch]);
  useEffect(() => {
    if (data) {
      setForm({
        mission: data.mission || '',
        vision: data.vision || '',
        coreValues: data.coreValues || [],
        teamMembers: data.teamMembers || [],
        milestones: data.milestones || [],
      });
    }
  }, [data]);

  const handleArrayChange = (field, index, key, value) => {
    const updated = [...form[field]];
    updated[index] = { ...updated[index], [key]: value };
    setForm({ ...form, [field]: updated });
  };

  const addItem = (field, template) => {
    setForm({ ...form, [field]: [...form[field], template] });
  };

  const removeItem = (field, index) => {
    const updated = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateAbout(form));   // ← matches import
  };

  return (
    <div>
      <h2>Edit About Page</h2>
      {isLoading && <p>Loading...</p>}
      <form onSubmit={handleSubmit} className="about-form">
        <label>Mission:</label>
        <textarea value={form.mission} onChange={e => setForm({...form, mission: e.target.value})} />

        <label>Vision:</label>
        <textarea value={form.vision} onChange={e => setForm({...form, vision: e.target.value})} />

        <h3>Core Values</h3>
        {form.coreValues.map((cv, i) => (
          <div key={i} className="array-item">
            <input placeholder="Icon" value={cv.icon} onChange={e => handleArrayChange('coreValues', i, 'icon', e.target.value)} />
            <input placeholder="Title" value={cv.title} onChange={e => handleArrayChange('coreValues', i, 'title', e.target.value)} />
            <input placeholder="Description" value={cv.description} onChange={e => handleArrayChange('coreValues', i, 'description', e.target.value)} />
            <input placeholder="Color" value={cv.color} onChange={e => handleArrayChange('coreValues', i, 'color', e.target.value)} />
            <button type="button" onClick={() => removeItem('coreValues', i)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addItem('coreValues', { icon: '', title: '', description: '', color: '' })}>Add Value</button>

        <h3>Team Members</h3>
        {form.teamMembers.map((member, i) => (
          <div key={i} className="array-item">
            <input placeholder="Name" value={member.name} onChange={e => handleArrayChange('teamMembers', i, 'name', e.target.value)} />
            <input placeholder="Role" value={member.role} onChange={e => handleArrayChange('teamMembers', i, 'role', e.target.value)} />
            <input placeholder="Image URL" value={member.image} onChange={e => handleArrayChange('teamMembers', i, 'image', e.target.value)} />
            <textarea placeholder="Bio" value={member.bio} onChange={e => handleArrayChange('teamMembers', i, 'bio', e.target.value)} />
            <button type="button" onClick={() => removeItem('teamMembers', i)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addItem('teamMembers', { name: '', role: '', image: '', bio: '' })}>Add Member</button>

        <h3>Milestones</h3>
        {form.milestones.map((milestone, i) => (
          <div key={i} className="array-item">
            <input placeholder="Year" value={milestone.year} onChange={e => handleArrayChange('milestones', i, 'year', e.target.value)} />
            <input placeholder="Event" value={milestone.event} onChange={e => handleArrayChange('milestones', i, 'event', e.target.value)} />
            <input placeholder="Description" value={milestone.description} onChange={e => handleArrayChange('milestones', i, 'description', e.target.value)} />
            <button type="button" onClick={() => removeItem('milestones', i)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addItem('milestones', { year: '', event: '', description: '' })}>Add Milestone</button>

        <button type="submit" style={{ marginTop: 20 }}>Save About</button>
      </form>
    </div>
  );
};
export default AboutEdit;