import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, clearPostMessage } from "../redux/PostSlice.jsx";
import { useNavigate } from "react-router-dom";
import "../CSS/ProfileCss.css"; // Reuse upload styles

const CreatePost = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, successMessage } = useSelector((state) => state.uploadPosts);

    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        document.title = "Share Your Artwork | TrueCanvas";
        if (successMessage) {
            setTimeout(() => {
                dispatch(clearPostMessage());
                navigate("/private/posts");
            }, 2000);
        }
    }, [successMessage, dispatch, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !image) return alert("Please fill all fields");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("image_url", image);

        dispatch(createPost(formData));
    };

    return (
        <div className="create-post-wrapper" style={{ maxWidth: '800px', margin: '80px auto', padding: '0 30px' }}>
            <div className="page-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '12px' }}>New Work</h1>
                <p style={{ color: 'var(--muted-text)', fontSize: '1.2rem' }}>Every stroke tells a story. Share yours with the world.</p>
            </div>

            <div className="upload-container" style={{ background: 'var(--white)', padding: '50px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
                <form onSubmit={handleSubmit} className="art-upload-form">
                    <div className="upload-visual" style={{ marginBottom: '40px' }}>
                        <div
                            className="drop-zone"
                            onClick={() => document.getElementById('file-upload').click()}
                            style={{
                                aspectRatio: '16/9',
                                border: '2px dashed var(--border-color)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                background: 'var(--primary-bg)'
                            }}
                        >
                            {preview ? (
                                <img src={preview} alt="Upload Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>🖼️</span>
                                    <p style={{ fontWeight: '500', color: 'var(--muted-text)' }}>Click to upload your masterpiece</p>
                                </div>
                            )}
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => {
                                    setImage(e.target.files[0]);
                                    setPreview(URL.createObjectURL(e.target.files[0]));
                                }}
                            />
                        </div>
                    </div>

                    <div className="form-fields" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div className="field-group">
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px', fontSize: '1rem' }}>Artwork Title</label>
                            <input
                                type="text"
                                placeholder="What do you call this piece?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '16px 20px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '18px',
                                borderRadius: '12px',
                                background: 'var(--text-color)',
                                color: 'var(--white)',
                                fontWeight: '700',
                                fontSize: '1.1rem',
                                transition: 'var(--transition)'
                            }}
                        >
                            {loading ? "Verifying Authenticity..." : "Publish Artwork"}
                        </button>

                        <p style={{ fontSize: '0.85rem', color: 'var(--muted-text)', textAlign: 'center' }}>
                            Note: All images are checked for AI generation. Only human-made art is accepted.
                        </p>
                    </div>
                </form>

                {successMessage && <div className="success-banner" style={{ marginTop: '30px', padding: '16px', background: '#e6f4ea', color: '#1e8e3e', borderRadius: '12px', textAlign: 'center', fontWeight: '600' }}>{successMessage}</div>}
                {error && <div className="error-banner" style={{ marginTop: '30px', padding: '16px', background: '#fce8e6', color: '#d93025', borderRadius: '12px', textAlign: 'center', fontWeight: '600' }}>{error}</div>}
            </div >
        </div >
    );
};

export default CreatePost;
