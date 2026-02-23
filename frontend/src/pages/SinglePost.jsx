import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSinglePost, fetchComments, addComment, likePost } from "../redux/PostSlice.jsx";
import "../CSS/AllPosts.css"; // Reuse shared artistic styles

const SinglePost = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { currentPost, comments, loading, error } = useSelector((state) => state.uploadPosts);
  const { user } = useSelector((state) => state.auth);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    dispatch(fetchSinglePost(postId));
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  useEffect(() => {
    if (currentPost) {
      document.title = `${currentPost.title} | TrueCanvas`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", `View ${currentPost.title} by ${currentPost.author} on TrueCanvas. A platform for authentic, human-made art.`);
      }
    }
  }, [currentPost]);

  const handleLike = () => {
    if (!user) return alert("Please login to like");
    dispatch(likePost(postId)).then(() => dispatch(fetchSinglePost(postId)));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to comment");
    if (!commentText.trim()) return;
    dispatch(addComment({ postId, comment: commentText })).then(() => {
      setCommentText("");
      dispatch(fetchComments(postId));
    });
  };

  if (loading && !currentPost) return <div className="loading-state"><div className="spinner"></div></div>;
  if (error) return <div className="error-text">{error}</div>;
  if (!currentPost) return <div className="empty-state">Artwork not found.</div>;

  return (
    <div className="single-post-wrapper">
      <div className="post-detail-container">
        <div className="post-visual">
          <img src={currentPost.image_url} alt={currentPost.title} className="detail-image" />
        </div>

        <div className="post-details">
          <div className="post-header-detail">
            <h1>{currentPost.title}</h1>
            <div className="author-info-detail">
              <img src={currentPost.author_avatar || "https://via.placeholder.com/40"} alt="Author" />
              <span>by <strong>{currentPost.author}</strong></span>
            </div>
          </div>

          <div className="post-interactions-detail">
            <button onClick={handleLike} className="like-btn-detail">
              ❤️ {currentPost.likes?.length || 0} Likes
            </button>
            <span className="date-detail">Published {new Date(currentPost.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="comments-section">
            <h3>Comments ({comments.length})</h3>
            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="no-comments">Be the first to share your thoughts on this masterpiece.</p>
              ) : (
                comments.map((c) => (
                  <div key={c._id} className="comment-item">
                    <strong>{c.author?.username || "Artist"}:</strong>
                    <p>{c.comment}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="comment-form">
              <input
                type="text"
                placeholder="Share your appreciation..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit">Post</button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .single-post-wrapper {
          max-width: 1200px;
          margin: 60px auto;
          padding: 0 30px;
        }
        .post-detail-container {
          display: grid;
          grid-template-columns: 1fr 450px;
          gap: 60px;
          background: var(--white);
          border-radius: 32px;
          overflow: hidden;
          box-shadow: var(--shadow);
        }
        .post-visual img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .post-details {
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
        }
        .post-header-detail h1 {
          font-size: 2.5rem;
          margin-bottom: 24px;
        }
        .author-info-detail {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
        }
        .author-info-detail img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        .post-interactions-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 30px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 40px;
        }
        .like-btn-detail {
          background: var(--secondary-bg);
          padding: 10px 20px;
          border-radius: 50px;
          font-weight: 600;
        }
        .comments-section h3 {
          font-size: 1.4rem;
          margin-bottom: 24px;
        }
        .comments-list {
          flex: 1;
          max-height: 300px;
          overflow-y: auto;
          margin-bottom: 24px;
          padding-right: 10px;
        }
        .comment-item {
          margin-bottom: 16px;
          font-size: 0.95rem;
        }
        .comment-item strong {
          display: block;
          margin-bottom: 4px;
        }
        .comment-form {
          display: flex;
          gap: 12px;
        }
        .comment-form input {
          flex: 1;
          padding: 12px 20px;
          border-radius: 50px;
          border: 1px solid var(--border-color);
          background: var(--primary-bg);
        }
        .comment-form button {
          background: var(--text-color);
          color: var(--white);
          padding: 0 24px;
          border-radius: 50px;
          font-weight: 600;
        }
        @media (max-width: 1024px) {
          .post-detail-container { grid-template-columns: 1fr; }
          .post-visual { aspect-ratio: 4/5; }
        }
      `}</style>
    </div>
  );
};

export default SinglePost;
