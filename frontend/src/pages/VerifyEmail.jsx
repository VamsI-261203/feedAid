import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
                console.error("Response status:", error.response.status);
                console.error("Response data:", error.response.data);
                const errMsg = error.response.data?.error || error.response.data?.message || JSON.stringify(error.response.data);
                alert(`Verification failed (Status ${error.response.status}): ${errMsg}`);
            } else if (error.request) {
                console.error("No response received for request:", error.request);
                alert("Verification failed: No response received from server. Please verify if the Spring Boot backend is active on http://localhost:8080.");
            } else {
                console.error("Request configuration error:", error.message);
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
                console.error("Response status:", error.response.status);
                console.error("Response data:", error.response.data);
                const errMsg = error.response.data?.error || error.response.data?.message || JSON.stringify(error.response.data);
                alert(`Resend failed (Status ${error.response.status}): ${errMsg}`);
            } else if (error.request) {
                console.error("No response received for request:", error.request);
                alert("Resend failed: No response received from server. Please verify if the Spring Boot backend is active on http://localhost:8080.");
            } else {
                console.error("Request configuration error:", error.message);
                alert(`Resend failed: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="main">
            <div className="login-box" style={{ maxWidth: '500px', margin: '50px auto' }}>
                <div className="form-content" style={{ padding: '30px', textAlign: 'center' }}>
                    <h2>Verify Your Email</h2>
                    <p>We've sent a 6-digit OTP to <strong>{email}</strong></p>
                    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Enter 6-digit OTP" 
                                maxLength="6"
                                pattern="\d{6}"
                                title="6-digit code"
                                required 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                disabled={loading}
                                style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '2px' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-success" disabled={loading || otp.length !== 6} style={{ width: '100%', padding: '10px' }}>
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </form>
                    <div style={{ marginTop: '20px' }}>
                        <button 
                            type="button" 
                            className="btn btn-link" 
                            onClick={handleResend} 
                            disabled={resendTimer > 0 || loading}
                            style={{ background: 'none', border: 'none', color: '#007bff', cursor: resendTimer > 0 ? 'not-allowed' : 'pointer', textDecoration: 'underline' }}
                        >
                            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VerifyEmail;
