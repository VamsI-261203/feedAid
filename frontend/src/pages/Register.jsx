import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/login.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', formData);
            alert(response.data.message || "Registration successful! Please verify your email.");
            navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        } catch (error) {
            console.error(error);
            alert("Registration failed: " + (error.response?.data?.error || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="main">
            <div className="login-card-container">
                {/* Left decorative panel */}
                <div className="leftboximg" id="leftbox">
                    <div className="gradient-overlay"></div>
                    <div className="leftbox-content">
                        <h2 className="imgdesc">Join<br />FeedAid</h2>
                        <p className="leftbox-sub">Create your account and start making a difference. Donate food or find meals in minutes.</p>
                    </div>
                    <img className="Foodbox" src="/img/Food_box.png" alt="Food sharing background graphic" />
                </div>

                {/* Right form panel */}
                <div className="rightboxlogin" id="rightbox">
                    <form onSubmit={handleSubmit} className="loginform" noValidate>
                        <div className="logo_icon">
                            <img src="/img/logo.png" className="logo_page" alt="Feed Aid Logo" />
                            <h2>Create Account</h2>
                        </div>
                        <div className="secondheading">
                            <h5>Already have an account? <Link to="/login" className="signup-link">Sign in</Link></h5>
                        </div>

                        <div className="inputs">
                            <label className="inp-label" htmlFor="reg-name">Full Name</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    name="name"
                                    className="user-input"
                                    id="reg-name"
                                    placeholder="Your full name"
                                    required
                                    onChange={handleChange}
                                    value={formData.name}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="inputs">
                            <label className="inp-label" htmlFor="reg-email">Email Address</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    name="email"
                                    className="user-input"
                                    id="reg-email"
                                    placeholder="name@example.com"
                                    required
                                    onChange={handleChange}
                                    value={formData.email}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="inputs">
                            <label className="inp-label" htmlFor="reg-password">Password</label>
                            <div className="input-wrapper">
                                <input
                                    type="password"
                                    name="password"
                                    className="user-password"
                                    id="reg-password"
                                    placeholder="Min 8 chars, 1 Upper, 1 Special"
                                    required
                                    onChange={handleChange}
                                    value={formData.password}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="inputs">
                            <label className="inp-label" htmlFor="reg-phone">Phone Number</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    name="phone"
                                    className="user-input"
                                    id="reg-phone"
                                    placeholder="10-digit mobile number"
                                    pattern="[0-9]{10}"
                                    title="Must be exactly 10 digits"
                                    required
                                    onChange={handleChange}
                                    value={formData.phone}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`Login-btn ${loading ? 'is-loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? <span className="btn-spinner" aria-hidden="true"></span> : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Register;
