import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSiteSettings, updateSiteSettings } from '../redux/slices/siteSettingsSlice';

const SiteSettings = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector(state => state.siteSettings);
  const [form, setForm] = useState({
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    workingHours: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      github: '',
      dribbble: '',
      instagram: '',
    }
  });

  useEffect(() => { dispatch(fetchSiteSettings()); }, [dispatch]);

  useEffect(() => {
    if (data) {
      setForm({
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zip: data.zip || '',
        workingHours: data.workingHours || '',
        socialLinks: {
          twitter: data.socialLinks?.twitter || '',
          linkedin: data.socialLinks?.linkedin || '',
          github: data.socialLinks?.github || '',
          dribbble: data.socialLinks?.dribbble || '',
          instagram: data.socialLinks?.instagram || '',
        }
      });
    }
  }, [data]);

  const handleChange = (e) => {
    if (e.target.name.startsWith('social.')) {
      const platform = e.target.name.split('.')[1];
      setForm({
        ...form,
        socialLinks: {
          ...form.socialLinks,
          [platform]: e.target.value
        }
      });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSiteSettings(form));
  };

  return (
    <div>
      <h2>Site Settings</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">Error: {error}</p>}
      <form onSubmit={handleSubmit} className="site-settings-form">
        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} />
        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} />
        <label>Address</label>
        <input name="address" value={form.address} onChange={handleChange} />
        <label>City</label>
        <input name="city" value={form.city} onChange={handleChange} />
        <label>State</label>
        <input name="state" value={form.state} onChange={handleChange} />
        <label>ZIP</label>
        <input name="zip" value={form.zip} onChange={handleChange} />
        <label>Working Hours</label>
        <input name="workingHours" value={form.workingHours} onChange={handleChange} />

        <h3>Social Links</h3>
        <label>Twitter</label>
        <input name="social.twitter" value={form.socialLinks.twitter} onChange={handleChange} />
        <label>LinkedIn</label>
        <input name="social.linkedin" value={form.socialLinks.linkedin} onChange={handleChange} />
        <label>GitHub</label>
        <input name="social.github" value={form.socialLinks.github} onChange={handleChange} />
        <label>Dribbble</label>
        <input name="social.dribbble" value={form.socialLinks.dribbble} onChange={handleChange} />
        <label>Instagram</label>
        <input name="social.instagram" value={form.socialLinks.instagram} onChange={handleChange} />

        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
};

export default SiteSettings;