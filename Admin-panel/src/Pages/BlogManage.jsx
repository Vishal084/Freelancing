import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, addBlog, editBlog, removeBlog } from '../redux/slices/blogsSlice';

const BlogManage = () => {
  const dispatch = useDispatch();
  const { list, isLoading } = useSelector(state => state.blogs);
  const [form, setForm] = useState({ title: '', content: '', image: '', author: '', tags: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => { dispatch(fetchBlogs()); }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert tags string to array
    const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    if (editId) {
      dispatch(editBlog({ id: editId, data }));
    } else {
      dispatch(addBlog(data));
    }
    setForm({ title: '', content: '', image: '', author: '', tags: '' });
    setEditId(null);
  };

  const handleEdit = (blog) => {
    setForm({
      title: blog.title,
      content: blog.content,
      image: blog.image || '',
      author: blog.author || '',
      tags: blog.tags ? blog.tags.join(', ') : ''
    });
    setEditId(blog.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this blog post?')) dispatch(removeBlog(id));
  };

  return (
    <div>
      <h2>Blog Management</h2>
      <form onSubmit={handleSubmit} className="crud-form">
        <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        <textarea placeholder="Content" value={form.content} onChange={e => setForm({...form, content: e.target.value})} required rows={4} />
        <input placeholder="Image URL (optional)" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
        <input placeholder="Author" value={form.author} onChange={e => setForm({...form, author: e.target.value})} />
        <input placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
        <button type="submit">{editId ? 'Update' : 'Add'} Blog</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: '', content: '', image: '', author: '', tags: '' }); }}>Cancel</button>}
      </form>

      {isLoading ? <p>Loading...</p> : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(blog => (
              <tr key={blog.id}>
                <td>{blog.title}</td>
                <td>{blog.author}</td>
                <td>{blog.tags?.join(', ')}</td>
                <td>
                  <button onClick={() => handleEdit(blog)}>Edit</button>
                  <button onClick={() => handleDelete(blog.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BlogManage;