import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/global.css';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    useEffect(() => {
        let interval = null;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(timer => timer - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Sending Verify Email Request with payload:", { email, otp });
        try {
            const response = await axios.post('http://localhost:8080/api/auth/verify-email', { email, otp });
            console.log("Verify Email Response Success:", response.data);
            alert(response.data.message || "Email verified successfully!");
            navigate('/login');
        } catch (error) {
            console.error("Axios Verify Email Error Details:", error);
            if (error.response) {
                const errMsg = error.response.data?.error || error.response.data?.message || JSON.stringify(error.response.data);
                alert(`Verification failed (Status ${error.response.status}): ${errMsg}`);
            } else if (error.request) {
                alert("Verification failed: No response received from server. Please verify if the Spring Boot backend is active on http://localhost:8080.");
            } else {
                alert(`Verification failed: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setLoading(true);
        console.log("Sending Resend Verification OTP Request with payload:", { email });
        try {
            const response = await axios.post('http://localhost:8080/api/auth/resend-verification-otp', { email });
            console.log("Resend Verification OTP Response Success:", response.data);
            alert(response.data.message || "OTP resent successfully!");
            setResendTimer(60);
        } catch (error) {
            console.error("Axios Resend Verification OTP Error Details:", error);
            if (error.response) {
                const errMsg = error.response.data?.error || error.response.data?.message || JSON.stringify(error.response.data);
                alert(`Resend failed (Status ${error.response.status}): ${errMsg}`);
            } else if (error.request) {
                alert("Resend failed: No response received from server. Please verify if the Spring Boot backend is active on http://localhost:8080.");
            } else {
                alert(`Resend failed: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="main">
            <div className="auth-card">
                <div className="auth-card-header">
                    <div className="auth-card-icon">📬</div>
                    <h2>Verify Your Email</h2>
                    <p>We've sent a 6-digit OTP to <strong>{email}</strong>. Enter it below to activate your account.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="otp-input">Enter OTP</label>
                        <input
                            type="text"
                            className="form-control otp-input"
                            id="otp-input"
                            placeholder="• • • • • •"
                            maxLength="6"
                            pattern="\d{6}"
                            title="6-digit code"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading || otp.length !== 6}>
                        {loading ? <span className="btn-spinner"></span> : '✅ Verify Email'}
                    </button>
                </form>

                <div className="resend-area">
                    <button
                        type="button"
                        className="btn-ghost"
                        onClick={handleResend}
                        disabled={resendTimer > 0 || loading}
                    >
                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                </div>

                <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.875rem', color: 'var(--gray-400)' }}>
                    Wrong email? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Go back</Link>
                </p>
            </div>
        </section>
    );
};

export default VerifyEmail;
