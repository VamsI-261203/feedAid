import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/reviews.css';

const Reviews = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    // Form states
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [role, setRole] = useState('Donor'); // default

    // Feedback notifications
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

    // Fetch all reviews on mount
    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/reviews');
            setReviews(response.data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            showToast("Failed to load reviews. Please verify connection to server.", "error");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'error') => {
        setToast({ show: true, message, type });
        const timer = setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 5000);
        return () => clearTimeout(timer);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validations
        if (!user) {
            showToast("Please sign in to write a review.", "warning");
            return;
        }
        if (rating < 1 || rating > 5) {
            showToast("Please select a star rating between 1 and 5.", "warning");
            return;
        }
        if (!title.trim()) {
            showToast("Review title is mandatory.", "warning");
            return;
        }
        if (!description.trim()) {
            showToast("Review description is mandatory.", "warning");
            return;
        }

        const payload = {
            email: user.email,
            role: role,
            rating: rating,
            title: title.trim(),
            description: description.trim()
        };

        setFormLoading(true);
        console.log("Submitting review payload:", payload);

        try {
            const response = await axios.post('http://localhost:8080/api/reviews', payload);
            console.log("Review submitted successfully:", response.data);
            showToast("Thank you! Your review has been published.", "success");
            
            // Reset form
            setRating(0);
            setTitle('');
            setDescription('');
            
            // Refresh list
            fetchReviews();
        } catch (error) {
            console.error("Review submission error:", error);
            if (error.response) {
                const errorMsg = error.response.data?.error || error.response.data?.message || "Failed to submit review.";
                showToast(errorMsg, "error");
            } else if (error.request) {
                showToast("No response received from server. Check if backend is active.", "error");
            } else {
                showToast(`Request failed: ${error.message}`, "error");
            }
        } finally {
            setFormLoading(false);
        }
    };

    // Calculate rating stats
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    const formatReviewDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <section className="reviews-section-main">
            {/* Custom Toast Notification */}
            {toast.show && (
                <div className={`toast-notification`} role="alert">
                    <span className="toast-icon">
                        {toast.type === 'success' && '✅'}
                        {toast.type === 'error' && '❌'}
                        {toast.type === 'warning' && '⚠️'}
                    </span>
                    <span className="toast-message">{toast.message}</span>
                    <button className="toast-close" onClick={() => setToast(prev => ({ ...prev, show: false }))}>×</button>
                </div>
            )}

            <div className="reviews-container">
                
                {/* Left Side: Submit Form or login alert */}
                <div className="reviews-form-card">
                    {user ? (
                        <>
                            <h2>Share Your Experience</h2>
                            <p>We would love to hear how FeedAid has helped you or what you think of our food redistribution services.</p>
                            
                            <form onSubmit={handleSubmit}>
                                {/* Rating Star Field */}
                                <div className="reviews-form-group">
                                    <label className="reviews-form-label">Your Rating</label>
                                    <div className="star-rating-container">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const isActive = star <= (hoverRating || rating);
                                            return (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className={`star-rating-btn ${isActive ? 'active' : ''}`}
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                                >
                                                    ★
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Reviewer Role field */}
                                <div className="reviews-form-group">
                                    <label className="reviews-form-label">Reviewing as a</label>
                                    <div className="reviews-role-toggle">
                                        <button
                                            type="button"
                                            className={`role-toggle-btn ${role === 'Donor' ? 'active' : ''}`}
                                            onClick={() => setRole('Donor')}
                                        >
                                            Donor
                                        </button>
                                        <button
                                            type="button"
                                            className={`role-toggle-btn ${role === 'Receiver' ? 'active' : ''}`}
                                            onClick={() => setRole('Receiver')}
                                        >
                                            Receiver
                                        </button>
                                    </div>
                                </div>

                                {/* Title Field */}
                                <div className="reviews-form-group">
                                    <label className="reviews-form-label" htmlFor="review-title">Review Title</label>
                                    <input
                                        type="text"
                                        id="review-title"
                                        className="reviews-input"
                                        placeholder="e.g. Excellent platform to save food!"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        disabled={formLoading}
                                        required
                                        maxLength={100}
                                    />
                                </div>

                                {/* Description Field */}
                                <div className="reviews-form-group">
                                    <label className="reviews-form-label" htmlFor="review-desc">Review Details</label>
                                    <textarea
                                        id="review-desc"
                                        className="reviews-input reviews-textarea"
                                        placeholder="Tell us about your experience..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={formLoading}
                                        required
                                        maxLength={1000}
                                    />
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    className="reviews-submit-btn"
                                    disabled={formLoading || rating === 0 || !title.trim() || !description.trim()}
                                >
                                    {formLoading ? 'Publishing...' : 'Submit Review'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="reviews-form-login-alert">
                            <h3>Want to write a review?</h3>
                            <p>You must be signed in with a verified email account to submit feedback on FeedAid.</p>
                            <Link to="/login" className="login-redirect-btn">Sign In to FeedAid</Link>
                        </div>
                    )}
                </div>

                {/* Right Side: List of Reviews */}
                <div className="reviews-list-container">
                    
                    {/* Header stats bar */}
                    <div className="reviews-header-stats">
                        <h3 className="reviews-stats-title">User Reviews</h3>
                        <div className="reviews-stats-summary">
                            <span className="reviews-stats-rating">{averageRating}</span>
                            <div>
                                <div className="reviews-stats-stars">
                                    {"★".repeat(Math.round(parseFloat(averageRating)))}
                                    {"☆".repeat(5 - Math.round(parseFloat(averageRating)))}
                                </div>
                                <span className="reviews-stats-count">{reviews.length} feedback posts</span>
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    {loading ? (
                        <div className="reviews-loading-container">
                            <div className="reviews-spinner"></div>
                            <p>Loading reviews...</p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="reviews-empty-state">
                            <span className="reviews-empty-icon">⭐</span>
                            <h3>No reviews yet</h3>
                            <p>Be the first one to write a review about your experience with FeedAid!</p>
                        </div>
                    ) : (
                        reviews.map((rev) => {
                            const initial = rev.reviewerName ? rev.reviewerName.charAt(0).toUpperCase() : 'U';
                            return (
                                <div key={rev.id} className="reviews-card">
                                    <div className="reviews-card-header">
                                        <div className="reviewer-meta">
                                            <div className="reviewer-avatar">
                                                {initial}
                                            </div>
                                            <div className="reviewer-info">
                                                <h4 className="reviewer-name">{rev.reviewerName}</h4>
                                                <span className={`reviewer-role ${rev.reviewerRole.toLowerCase()}`}>
                                                    {rev.reviewerRole}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="review-stars">
                                            {"★".repeat(rev.rating)}
                                            {"☆".repeat(5 - rev.rating)}
                                        </div>
                                    </div>
                                    <h4 className="review-card-title">{rev.title}</h4>
                                    <p className="review-card-desc">{rev.description}</p>
                                    <div className="review-card-footer">
                                        <span className="review-date">Published on {formatReviewDate(rev.createdAt)}</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </section>
    );
};

export default Reviews;
