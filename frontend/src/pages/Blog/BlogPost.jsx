// frontend/src/pages/Blog/BlogPost.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import './BlogPost.css';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/blogs/${slug}`);
        setPost(res.data);
      } catch (err) {
        setError('Blog post not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <main className="container">
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <p>{error}</p>
        <Link to="/blog" className="btn btn-secondary">
          ← Back to Blog
        </Link>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="container">
        <p>No post found.</p>
        <Link to="/blog" className="btn btn-secondary">
          ← Back to Blog
        </Link>
      </main>
    );
  }

  // Ensure content is a string before rendering
  const content = typeof post.content === 'string' ? post.content : '';

  return (
    <>
      <Helmet>
        <title>{post.title || 'Blog Post'} – FreelancePro Blog</title>
        <meta
          name="description"
          content={
            typeof post.excerpt === 'string'
              ? post.excerpt
              : content.substring(0, 160)
          }
        />
      </Helmet>

      <main className="container blog-post">
        <article>
          <h1>{post.title || 'Untitled'}</h1>
          <p className="blog-post-meta">
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : ''}{' '}
            • {post.author || 'Admin'}
          </p>

          {post.image && (
            <img
              src={post.image}
              alt={post.title || 'Blog image'}
              className="blog-post-image"
            />
          )}

          <div className="blog-post-content">{content}</div>
        </article>

        <Link to="/blog" className="btn btn-secondary">
          ← Back to Blog
        </Link>
      </main>
    </>
  );
};

export default BlogPost;