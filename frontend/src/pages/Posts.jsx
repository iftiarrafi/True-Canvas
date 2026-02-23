import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllPosts } from "../redux/FetchAllPosts.jsx";
import { likePost, savePost } from "../redux/PostSlice.jsx";
import "../CSS/AllPosts.css";

const AllPosts = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const POSTS_PER_PAGE = 9;

  useEffect(() => {
    document.title = "Explore Gallery | TrueCanvas";
    dispatch(fetchAllPosts({ search, page, limit: POSTS_PER_PAGE }));
  }, [dispatch, search, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleLike = (postId) => {
    if (!user) return alert("Please login to like posts");
    dispatch(likePost(postId)).then(() => {
      dispatch(fetchAllPosts({ search, page, limit: POSTS_PER_PAGE }));
    });
  };

  const handleSave = (postId) => {
    if (!user) return alert("Please login to save posts");
    dispatch(savePost(postId));
  };

  return (
    <div className="posts-container">
      <header className="page-header">
        <h1 className="heading">The Collective</h1>
        <p className="subheading">Visual narratives from the human soul.</p>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </header>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Curating gallery...</p>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      {!loading && posts.length === 0 && (
        <div className="empty-state">
          <p>No masterpieces found matching your search.</p>
        </div>
      )}

      <div className="posts-masonry">
        {posts.map((post) => (
          <Link to={`/post/${post._id}`} key={post._id} className="art-card-link">
            <div className="art-card">
              <div className="image-wrapper">
                <img src={post.image_url} alt={post.title} className="art-image" />
                <div className="interaction-overlay">
                  <button onClick={(e) => { e.preventDefault(); handleLike(post._id); }} className="action-btn like">
                    ❤️ {post.likes.length}
                  </button>
                  <button onClick={(e) => { e.preventDefault(); handleSave(post._id); }} className="action-btn save">
                    🔖
                  </button>
                </div>
              </div>
              <div className="art-info">
                <h2 className="art-title">{post.title}</h2>
                <div className="art-meta">
                  <span className="art-author">by <strong>{post.author?.name || post.author}</strong></span>
                  <span className="art-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="pagination-bar">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="page-btn"
        >
          Previous
        </button>
        <span className="page-info">Selection {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={posts.length < POSTS_PER_PAGE}
          className="page-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllPosts;
