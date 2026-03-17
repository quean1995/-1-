import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Home.css';

const featuredPosts = [
  {
    id: 1,
    title: 'Building a Modern Blog with Vite and React',
    excerpt: 'Learn how to set up a lightning-fast development environment and craft a beautiful blog from scratch.',
    date: 'Oct 24, 2023',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'The Art of Clean CSS Architecture',
    excerpt: 'Discover the secrets to writing maintainable, scalable, and modern CSS without relying on heavy frameworks.',
    date: 'Nov 02, 2023',
    readTime: '8 min read'
  }
];

export default function Home() {
  return (
    <div className="home fade-in">
      <section className="hero container">
        <h1 className="hero-title">
          Hi, I am <span className="highlight">Developer</span>.<br/>
          I build things for the web.
        </h1>
        <p className="hero-subtitle">
          Welcome to my digital garden. I write about React, CSS, and modern web development.
        </p>
        <Link to="/blog" className="cta-button">
          Read my articles <ArrowRight size={18} />
        </Link>
      </section>

      <section className="featured container">
        <h2 className="section-title">Featured Posts</h2>
        <div className="post-grid">
          {featuredPosts.map(post => (
            <article key={post.id} className="post-card">
              <span className="post-meta">{post.date} &middot; {post.readTime}</span>
              <h3 className="post-title">
                <Link to={`/blog/${post.id}`}>{post.title}</Link>
              </h3>
              <p className="post-excerpt">{post.excerpt}</p>
              <Link to={`/blog/${post.id}`} className="read-more">
                Read article <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
