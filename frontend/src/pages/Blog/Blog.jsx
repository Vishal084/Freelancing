import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, selectBlogs, selectBlogsLoading, selectBlogsError } from '../../redux/slices/blogSlice';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const Blog = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(selectBlogs);
  const isLoading = useSelector(selectBlogsLoading);
  const error = useSelector(selectBlogsError);

  useEffect(() => { dispatch(fetchBlogs()); }, [dispatch]);

  return (
    <main className="container blog-page">
      <Helmet><title>Blog – FreelancePro</title></Helmet>
      <h1>Our Blog</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">Failed to load posts.</p>}
      {!isLoading && !error && blogs.length === 0 && <p>No posts yet.</p>}
      <div className="blog-grid">
        {blogs.map(post => (
          <article key={post._id} className="blog-card">
            <h2>{post.title}</h2>
            <p className="date">{new Date(post.createdAt).toLocaleDateString()}</p>
            <p>{post.excerpt || post.content.substring(0, 150)}</p>
            <Link to={`/blog/${post.slug}`} className="btn">Read More</Link>
          </article>
        ))}
      </div>
    </main>
  );
};