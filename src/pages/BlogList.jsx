import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './BlogList.css';

const allPosts = [
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
  },
  {
    id: 3,
    title: 'Understanding React Hooks deeply',
    excerpt: 'A deep dive into useEffect, useCallback, and useMemo. When to use them and when to avoid them.',
    date: 'Nov 15, 2023',
    readTime: '10 min read'
  }
];

export default function BlogList() {
  return (
    <div className="blog-list-page container fade-in">
      <header className="page-header">
        <h1 className="page-title">Blog <span>Posts</span></h1>
        <p className="page-subtitle">Thoughts, learnings, and tutorials.</p>
      </header>

      <div className="posts-container">
        {allPosts.map(post => (
          <article key={post.id} className="list-post-card">
            <div className="list-post-content">
              <span className="post-meta">{post.date} &middot; {post.readTime}</span>
              <h2 className="list-post-title">
                <Link to={`/blog/${post.id}`}>{post.title}</Link>
              </h2>
              <p className="post-excerpt">{post.excerpt}</p>
            </div>
            <Link to={`/blog/${post.id}`} className="read-more-circle">
              <ArrowRight size={20} />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
