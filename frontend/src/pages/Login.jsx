import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [touched, setTouched] = useState({ email: false, password: false });
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [capsLock, setCapsLock] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

    // Validate inputs dynamically
    useEffect(() => {
        const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
        let emailErr = '';
        let passErr = '';

        if (touched.email) {
            if (!formData.email) {
                emailErr = 'Email address is required.';
            } else if (!emailRegex.test(formData.email)) {
                emailErr = 'Please enter a valid email address.';
            }
        }

        if (touched.password) {
            if (!formData.password) {
                passErr = 'Password is required.';
            } else if (formData.password.length < 8) {
                passErr = 'Password must be at least 8 characters long.';
            }
        }

        setErrors({ email: emailErr, password: passErr });
    }, [formData, touched]);

    // Handle Caps Lock detection
    const handleKeyUp = (e) => {
        if (e.getModifierState) {
            setCapsLock(e.getModifierState('CapsLock'));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const showToast = (message, type = 'error') => {
        setToast({ show: true, message, type });
        // Auto-hide toast after 5 seconds
        const timer = setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 5000);
        return () => clearTimeout(timer);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Trigger all validation
        setTouched({ email: true, password: true });
        
        const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
        if (!emailRegex.test(formData.email) || formData.password.length < 8) {
            showToast('Please fix validation errors before logging in.', 'warning');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);
            
            showToast('Login successful! Redirecting...', 'success');
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.dispatchEvent(new Event('storage'));
            
            // Redirect after 1.5 seconds so user can see success toast
            setTimeout(() => {
                navigate('/');
            }, 1200);
            
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.error || "Login failed: Invalid email or password";
            
            if (errorMsg.toLowerCase().includes("verify your email")) {
                showToast(errorMsg + " Redirecting to verification page...", 'warning');
                setTimeout(() => {
                    navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
                }, 2000);
            } else {
                showToast(errorMsg, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    // Determine if form is valid to enable submit button
    const isFormValid = formData.email && formData.password && !errors.email && !errors.password;

    return (
        <section className="main" onKeyUp={handleKeyUp}>
            {/* Custom Toast Notification */}
            {toast.show && (
                <div className={`toast-notification toast-${toast.type}`} role="alert" aria-live="assertive">
                    <span className="toast-icon">
                        {toast.type === 'success' && '✅'}
                        {toast.type === 'error' && '❌'}
                        {toast.type === 'warning' && '⚠️'}
                        {toast.type === 'info' && 'ℹ️'}
                    </span>
                    <span className="toast-message">{toast.message}</span>
                    <button className="toast-close" onClick={() => setToast(prev => ({ ...prev, show: false }))} aria-label="Close notification">×</button>
                </div>
            )}

            <div className="login-card-container">
                <div className="leftboximg" id="leftbox">
                    <div className="gradient-overlay"></div>
                    <div className="leftbox-content">
                        <h2 className="imgdesc">Welcome<br />Back</h2>
                        <p className="leftbox-sub">Join us in making a difference. Donate extra food and feed those in need.</p>
                    </div>
                    <img className="Foodbox" src="/img/Food_box.png" alt="Food sharing background graphic" />
                </div>
                
                <div className="rightboxlogin" id="rightbox">
                    <form onSubmit={handleSubmit} className="loginform" noValidate>
                        <div className="logo_icon">
                            <img src="/img/logo.png" className="logo_page" alt="Feed Aid Logo" />
                            <h2>Sign In</h2>
                        </div>
                        <div className="secondheading">
                            <h5>Don't have an account? <Link to="/register" className="signup-link">Sign up</Link></h5>
                        </div>

                        {/* Email Input Field */}
                        <div className="inputs">
                            <label className="inp-label" htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <input 
                                    type="email" 
                                    name="email" 
                                    className={`user-input ${touched.email && errors.email ? 'is-invalid' : ''} ${touched.email && !errors.email && formData.email ? 'is-valid' : ''}`}
                                    id="email" 
                                    required 
                                    onChange={handleChange} 
                                    onBlur={() => handleBlur('email')}
                                    value={formData.email} 
                                    disabled={loading}
                                    placeholder="name@example.com"
                                    aria-invalid={touched.email && errors.email ? 'true' : 'false'}
                                    aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                                />
                                {touched.email && !errors.email && formData.email && (
                                    <span className="validation-icon valid">✓</span>
                                )}
                                {touched.email && errors.email && (
                                    <span className="validation-icon invalid">⚠</span>
                                )}
                            </div>
                            {touched.email && errors.email && (
                                <span className="error-message" id="email-error">{errors.email}</span>
                            )}
                        </div>

                        {/* Password Input Field */}
                        <div className="inputs">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label className="inp-label" htmlFor="password">Password</label>
                                <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
                            </div>
                            <div className="input-wrapper">
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    name="password" 
                                    className={`user-password ${touched.password && errors.password ? 'is-invalid' : ''} ${touched.password && !errors.password && formData.password ? 'is-valid' : ''}`}
                                    id="password" 
                                    required 
                                    onChange={handleChange} 
                                    onBlur={() => handleBlur('password')}
                                    value={formData.password} 
                                    disabled={loading}
                                    placeholder="Enter your password"
                                    aria-invalid={touched.password && errors.password ? 'true' : 'false'}
                                    aria-describedby={touched.password && errors.password ? 'password-error' : undefined}
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={!formData.password}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {touched.password && errors.password && (
                                <span className="error-message" id="password-error">{errors.password}</span>
                            )}
                            {capsLock && (
                                <div className="caps-lock-warning" role="alert">
                                    ⚠️ Caps Lock is ON
                                </div>
                            )}
                        </div>
                        
                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className={`Login-btn ${loading ? 'is-loading' : ''}`} 
                            disabled={loading || !isFormValid}
                        >
                            {loading ? (
                                <span className="btn-spinner" aria-hidden="true"></span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;
