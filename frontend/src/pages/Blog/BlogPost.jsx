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

  if (loading) return <main className="container"><p>Loading...</p></main>;
  if (error) return <main className="container"><p>{error}</p></main>;
  if (!post) return <main className="container"><p>No post found.</p></main>;

  return (
    <>
      <Helmet>
        <title>{post.title} – FreelancePro Blog</title>
        <meta name="description" content={post.excerpt || post.content?.substring(0, 160)} />
      </Helmet>
      <main className="container blog-post">
        <article>
          <h1>{post.title}</h1>
          <p className="blog-post-meta">
            {new Date(post.createdAt).toLocaleDateString()} • {post.author || 'Admin'}
          </p>
          {post.image && <img src={post.image} alt={post.title} className="blog-post-image" />}
          <div className="blog-post-content">{post.content}</div>
        </article>
        <Link to="/blog" className="btn btn-secondary">← Back to Blog</Link>
      </main>
    </>
  );
};

export default BlogPost;