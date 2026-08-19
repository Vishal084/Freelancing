// frontend/src/pages/Blog/Blog.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, selectBlogs, selectBlogsLoading, selectBlogsError } from '../../redux/slices/blogSlice';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Blog = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(selectBlogs);
  const isLoading = useSelector(selectBlogsLoading);
  const error = useSelector(selectBlogsError);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // Helper to safely get a short excerpt
  const getExcerpt = (post) => {
    if (typeof post?.excerpt === 'string' && post.excerpt.trim()) {
      return post.excerpt;
    }
    if (typeof post?.content === 'string') {
      return post.content.substring(0, 150);
    }
    return '';
  };

  // Helper to safely generate a link slug
  const getSlug = (post) => post?.slug || post?._id || post?.id;

  return (
    <main className="container blog-page">
      <Helmet>
        <title>Blog – FreelancePro</title>
        <meta name="description" content="Read our latest blog posts and insights." />
      </Helmet>

      <h1>Our Blog</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p className="error">Failed to load posts.</p>}
      {!isLoading && !error && (!Array.isArray(blogs) || blogs.length === 0) && (
        <p>No posts yet.</p>
      )}

      {!isLoading && !error && Array.isArray(blogs) && blogs.length > 0 && (
        <div className="blog-grid">
          {blogs.map((post) => (
            <article key={post._id || post.id} className="blog-card">
              <h2>{post.title || 'Untitled'}</h2>
              <p className="date">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
              </p>
              <p>{getExcerpt(post)}</p>
              <Link to={`/blog/${getSlug(post)}`} className="btn">
                Read More
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default Blog;