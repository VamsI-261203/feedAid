import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/global.css';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');

    const [step, setStep] = useState(1); // 1 = OTP, 2 = New Password
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Sending Verify Reset OTP Request with payload:", { email, otp });
        try {
            const response = await axios.post('http://localhost:8080/api/auth/verify-reset-otp', { email, otp });
            console.log("Verify Reset OTP Response Success:", response.data);
            alert(response.data.message || "OTP verified! Please enter your new password.");
            setStep(2);
        } catch (error) {
            console.error("Axios Verify Reset OTP Error Details:", error);
            if (error.response) {
                const errMsg = error.response.data?.error || error.response.data?.message || JSON.stringify(error.response.data);
                alert(`Verification failed (Status ${error.response.status}): ${errMsg}`);
            } else if (error.request) {
                alert("Verification failed: No response received from server.");
            } else {
                alert(`Verification failed: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Sending Reset Password Request with payload:", { email, otp, newPassword });
        try {
            const response = await axios.post('http://localhost:8080/api/auth/reset-password', { email, otp, newPassword });
            console.log("Reset Password Response Success:", response.data);
            alert(response.data.message || "Password reset successfully!");
            navigate('/login');
        } catch (error) {
            console.error("Axios Reset Password Error Details:", error);
            if (error.response) {
                const errMsg = error.response.data?.error || error.response.data?.message || JSON.stringify(error.response.data);
                alert(`Reset failed (Status ${error.response.status}): ${errMsg}`);
            } else if (error.request) {
                alert("Reset failed: No response received from server.");
            } else {
                alert(`Reset failed: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="main">
            <div className="auth-card">
                <div className="auth-card-header">
                    <div className="auth-card-icon">{step === 1 ? '🔑' : '🔒'}</div>
                    <h2>{step === 1 ? 'Enter Reset OTP' : 'Set New Password'}</h2>
                    <p>
                        {step === 1
                            ? <>OTP sent to <strong>{email}</strong>. Enter it below.</>
                            : 'Choose a strong new password for your account.'
                        }
                    </p>
                </div>

                {step === 1 && (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="reset-otp">6-Digit OTP</label>
                            <input
                                type="text"
                                className="form-control otp-input"
                                id="reset-otp"
                                placeholder="• • • • • •"
                                maxLength="6"
                                pattern="\d{6}"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading || otp.length !== 6}>
                            {loading ? <span className="btn-spinner"></span> : '✅ Verify OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="new-password">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="new-password"
                                placeholder="Min 8 chars, 1 Upper, 1 Lower, 1 Special"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={loading}
                            />
                            <span className="field-hint">Must be at least 8 characters with uppercase, lowercase, number &amp; special character.</span>
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading || !newPassword}>
                            {loading ? <span className="btn-spinner"></span> : '🔒 Reset Password'}
                        </button>
                    </form>
                )}

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: 'var(--gray-400)' }}>
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>← Back to Login</Link>
                </p>
            </div>
        </section>
    );
};

export default ResetPassword;
