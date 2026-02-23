import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyPosts, clearPostMessage } from "../redux/PostSlice.jsx";
import { updateProfile } from "../redux/AuthSlice.jsx";
import { Link } from "react-router-dom";
import "../CSS/ProfileCss.css";

const MyProfile = () => {
  const dispatch = useDispatch();
  const { error, successMessage, myPosts } = useSelector((state) => state.uploadPosts);
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    document.title = `${user?.name || user?.username || 'Artist'} | TrueCanvas Profile`;
    dispatch(fetchMyPosts());
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearPostMessage()), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch, user]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bio", bio);
    if (avatar) formData.append("avatar", avatar);
    dispatch(updateProfile(formData)).then(() => setIsEditing(false));
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-header">
        <div className="avatar-section">
          <img src={user?.avatar || "https://via.placeholder.com/150"} alt="Avatar" className="profile-avatar" />
          {isEditing && (
            <div className="avatar-edit-overlay">
              <input
                type="file"
                id="avatar-upload"
                hidden
                onChange={(e) => setAvatar(e.target.files[0])}
              />
              <label htmlFor="avatar-upload" className="avatar-label">Change Photo</label>
            </div>
          )}
        </div>

        <div className="profile-info">
          <div className="name-row">
            <h1>{user?.name || user?.username}</h1>
            <button onClick={() => setIsEditing(!isEditing)} className="edit-btn">
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="edit-form">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write your artistic bio..."
                className="bio-textarea"
              />
              <button type="submit" className="save-btn">Save Changes</button>
            </form>
          ) : (
            <p className="bio">{user?.bio || "No bio yet. Tell the world about your art."}</p>
          )}

          <div className="stats">
            <span><strong>{user?.followers?.length || 0}</strong> Followers</span>
            <span><strong>{user?.following?.length || 0}</strong> Following</span>
          </div>
        </div>
      </div>

      <div className="profile-actions-bar">
        <Link to="/private/create" className="create-shortcut">
          <span>+</span> Share New Artwork
        </Link>
      </div>

      <div className="user-gallery">
        <div className="gallery-header">
          <h3>My Gallery</h3>
          <span className="post-count">{myPosts?.length || 0} pieces</span>
        </div>

        {myPosts?.length === 0 ? (
          <div className="empty-gallery">
            <p>Your studio is empty. Share your first masterpiece!</p>
            <Link to="/private/create" className="cta-link">Get Started</Link>
          </div>
        ) : (
          <div className="profile-masonry">
            {myPosts.map((post) => (
              <Link to={`/post/${post._id}`} key={post._id} className="profile-art-item">
                <img src={post.image_url} alt={post.title} />
                <div className="item-overlay">
                  <span>{post.title}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
