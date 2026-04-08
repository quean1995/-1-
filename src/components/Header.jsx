import { Link } from 'react-router-dom';
import { Moon, Sun, Github, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';
import './Header.css';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (isDark) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }, [isDark]);
  return (
    <header className="header fade-in">
      <div className="container header-content">
        <Link to="/" className="logo-link"><span className="logo-text">DevBlog.</span></Link>
        <nav className="nav-links">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/blog" className="nav-item">Blog</Link>
          <Link to="/game" className="nav-item">Game</Link>
        </nav>
        <div className="header-actions">
          <a href="#" className="social-icon"><Github size={20} /></a>
          <a href="#" className="social-icon"><Twitter size={20} /></a>
          <button className="theme-toggle" onClick={() => setIsDark(!isDark)} aria-label="Toggle Theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
