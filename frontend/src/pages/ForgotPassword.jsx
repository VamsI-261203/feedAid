import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/global.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Sending Forgot Password Request with payload:", { email });
        try {
            const response = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
            console.log("Forgot Password Response Success:", response.data);
            alert(response.data.message || "OTP sent successfully!");
            navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.error("Axios Forgot Password Error Details:", error);
            if (error.response) {
                console.error("Response status:", error.response.status);
                console.error("Response data:", error.response.data);
                const errMsg = error.response.data?.error || error.response.data?.message || JSON.stringify(error.response.data);
                alert(`Request failed (Status ${error.response.status}): ${errMsg}`);
            } else if (error.request) {
                console.error("No response received for request:", error.request);
                alert("Request failed: No response received from server. Please verify if the Spring Boot backend is active on http://localhost:8080.");
            } else {
                console.error("Request configuration error:", error.message);
                alert(`Request failed: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="main">
            <div className="auth-card">
                <div className="auth-card-header">
                    <div className="auth-card-icon">ðŸ”</div>
                    <h2>Forgot Password</h2>
                    <p>Enter your registered email and we'll send you an OTP to reset your password.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="fp-email">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="fp-email"
                            placeholder="name@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading || !email}>
                        {loading ? <span className="btn-spinner"></span> : 'ðŸ“¨ Send OTP'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    Remember your password? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign In</Link>
                </p>
            </div>
        </section>
    );
};

export default ForgotPassword;
