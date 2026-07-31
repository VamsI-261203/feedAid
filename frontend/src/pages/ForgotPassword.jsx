import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/global.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
            alert(response.data.message || "OTP sent successfully!");
            navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.error(error);
            alert("Request failed: " + (error.response?.data?.error || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="main">
            <div className="login-box" style={{ maxWidth: '500px', margin: '50px auto' }}>
                <div className="form-content" style={{ padding: '30px', textAlign: 'center' }}>
                    <h2>Forgot Password</h2>
                    <p>Enter your registered email address and we'll send you an OTP to reset your password.</p>
                    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email"
                                placeholder="Enter your email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" className="btn btn-success" disabled={loading || !email} style={{ width: '100%', padding: '10px' }}>
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;
