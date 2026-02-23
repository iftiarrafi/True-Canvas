import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../redux/FetchAllPosts.jsx";
import { Link } from "react-router-dom";
import "../CSS/Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);

  useEffect(() => {
    document.title = "TrueCanvas | Human-Made Art Gallery";
    dispatch(fetchAllPosts({ search: "", page: 1, limit: 6 }));

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Experience the beauty of human-created art. TrueCanvas is a dedicated platform for artists to share their original, non-AI creations.");
    }
  }, [dispatch]);

  return (
    <div className="home-container">
      <header className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <span className="badge">Authenticity Guaranteed</span>
            <h1>Authentic Art, <br />Created by Humans.</h1>
            <p>
              TrueCanvas is a sanctuary for original imagination.
              We celebrate the soul that only a human hand can bring to a canvas.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="cta-btn primary">Start Your Journey</Link>
              <Link to="/about" className="cta-btn secondary">Our Mission</Link>
            </div>
          </div>
          <div className="hero-image-container">
            <img
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"
              alt="Sophisticated Art Piece"
              className="floating-art"
            />
            <div className="art-card-detail">
              <span>"The Human Touch"</span>
              <p>Original Oil on Canvas</p>
            </div>
          </div>
        </div>
      </header>

      <section className="gallery-preview">
        <div className="section-header">
          <h2>Latest Discoveries</h2>
          <p>Handpicked selections from our global community.</p>
        </div>
        <div className="masonry">
          {posts.slice(0, 6).map((post, index) => (
            <Link to={`/post/${post._id}`} key={post._id || index} className="masonry-item">
              <div className="art-frame">
                <img src={post.image_url} alt={post.title} />
                <div className="art-overlay">
                  <span>View Details</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="view-all-wrapper" style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/private/posts" className="view-all-link" style={{ color: 'var(--text-color)', fontWeight: '600', borderBottom: '2px solid var(--accent-color)', paddingBottom: '4px' }}>
            View Full Collection →
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">TrueCanvas</div>
          <p>&copy; {new Date().getFullYear()} TrueCanvas — Pure Imagination, No Algorithms.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
