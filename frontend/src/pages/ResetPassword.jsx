import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
                console.error("Response status:", error.response.status);
                console.error("Response data:", error.response.data);
                const errMsg = error.response.data?.error || error.response.data?.message || JSON.stringify(error.response.data);
                alert(`Reset failed (Status ${error.response.status}): ${errMsg}`);
            } else if (error.request) {
                console.error("No response received for request:", error.request);
                alert("Reset failed: No response received from server. Please verify if the Spring Boot backend is active on http://localhost:8080.");
            } else {
                console.error("Request configuration error:", error.message);
                alert(`Reset failed: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="main">
            <div className="login-box" style={{ maxWidth: '500px', margin: '50px auto' }}>
                <div className="form-content" style={{ padding: '30px', textAlign: 'center' }}>
                    <h2>Reset Password</h2>
                    <p>Account: <strong>{email}</strong></p>
                    
                    {step === 1 && (
                        <form onSubmit={handleVerifyOtp} style={{ marginTop: '20px' }}>
                            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                                <label>Enter 6-digit OTP</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    maxLength="6"
                                    pattern="\d{6}"
                                    required 
                                    value={otp} 
                                    onChange={(e) => setOtp(e.target.value)} 
                                    disabled={loading}
                                    style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '2px' }}
                                />
                            </div>
                            <button type="submit" className="btn btn-success" disabled={loading || otp.length !== 6} style={{ width: '100%', padding: '10px' }}>
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleResetPassword} style={{ marginTop: '20px' }}>
                            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                                <label>New Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="Min 8 chars, 1 Upper, 1 lower, 1 number, 1 special"
                                    required 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    disabled={loading}
                                />
                            </div>
                            <button type="submit" className="btn btn-success" disabled={loading || !newPassword} style={{ width: '100%', padding: '10px' }}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ResetPassword;
