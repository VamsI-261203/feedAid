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
        try {
            const response = await axios.post('http://localhost:8080/api/auth/verify-reset-otp', { email, otp });
            alert(response.data.message || "OTP verified! Please enter your new password.");
            setStep(2);
        } catch (error) {
            console.error(error);
            alert("Verification failed: " + (error.response?.data?.error || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/auth/reset-password', { email, otp, newPassword });
            alert(response.data.message || "Password reset successfully!");
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert("Reset failed: " + (error.response?.data?.error || "Unknown error"));
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
