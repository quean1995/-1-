import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './BlogPost.css';

export default function BlogPost() {
  const { id } = useParams();

  // Mock content for presentation
  return (
    <article className="blog-post fade-in">
      <div className="post-header-bg">
        <div className="container post-header-content">
          <Link to="/blog" className="back-link">
            <ArrowLeft size={16} /> Back to posts
          </Link>
          <div className="post-meta">Oct 24, 2023 &middot; 5 min read</div>
          <h1 className="post-title-large">Building a Modern Blog with Vite and React (Post {id})</h1>
        </div>
      </div>
      
      <div className="container post-body">
        <div className="post-content">
          <p className="lead">
            This is a mock blog post. In a real application, you would fetch the content for ID {id} from a CMS or a Markdown file.
          </p>
          <h2>Introduction</h2>
          <p>
            Vite has revolutionized the frontend tooling landscape. Its incredibly fast HMR and optimized build process make it the perfect choice for modern React applications.
          </p>
          <p>
            Coupled with a clean, well-architected global CSS file, you can build stunning interfaces without the overhead of massive CSS-in-JS libraries or utility-first frameworks.
          </p>
          <blockquote>
            "Simplicity is the ultimate sophistication." - Leonardo da Vinci
          </blockquote>
          <h2>The Design System</h2>
          <p>
            By defining a smart set of CSS variables on the <code>:root</code> level, we achieve seamless dark mode support...
          </p>
          <p>
            This ensures that our UI remains crisp, modern, and engaging for all readers.
          </p>
        </div>
      </div>
    </article>
  );
}
