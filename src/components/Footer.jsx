import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer fade-in">
      <div className="container footer-content">
        <p>&copy; {new Date().getFullYear()} DevBlog. All rights reserved.</p>
        <p className="footer-meta">Built with React & Vite.</p>
      </div>
    </footer>
  );
}
