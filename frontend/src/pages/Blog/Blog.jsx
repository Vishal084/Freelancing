// frontend/src/pages/Blog/Blog.jsx
import { Helmet } from 'react-helmet-async';
import './Blog.css'; // you can add this CSS later

const posts = [
  { id: 1, title: 'Why Your Business Needs a Progressive Web App', excerpt: 'PWAs offer...', date: '2024-01-15', slug: 'why-pwa' },
  { id: 2, title: 'Top 5 Tech Stacks for Startups in 2024', excerpt: 'Choosing the right...', date: '2024-02-01', slug: 'top-tech-stacks' }
];

const Blog = () => (
  <main className="container blog-page">
    <Helmet>
      <title>Blog – FreelancePro</title>
      <meta name="description" content="Read our latest articles on web development, mobile apps, and technology." />
    </Helmet>
    <h1>Our Blog</h1>
    <div className="blog-grid">
      {posts.map(post => (
        <article key={post.id} className="blog-card">
          <h2>{post.title}</h2>
          <p className="date">{post.date}</p>
          <p>{post.excerpt}</p>
          <a href={`/blog/${post.slug}`} className="btn">Read More</a>
        </article>
      ))}
    </div>
  </main>
);

export default Blog;