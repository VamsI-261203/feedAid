import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.dispatchEvent(new Event('storage'));
            navigate('/');
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.error || "Login failed: Invalid email or password";
            alert(errorMsg);
            if (errorMsg.includes("verify your email")) {
                navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="main">
            <div className="outercontainer">
                <div className="leftboximg" id="leftbox">
                    <h2 className="imgdesc">Welcome<br /> Back</h2>
                    <img className="Foodbox" src="/img/Food_box.png" alt="" />
                </div>
                <div className="rightboxlogin" id="rightbox">
                    <form onSubmit={handleSubmit} className="loginform">
                        <div className="logo_icon">
                            <img src="/img/logo.png" className="logo_page" alt="Logo" />
                            <h2>Login</h2>
                        </div>
                        <div className="secondheading">
                            <h5>Don't have an account? <Link to="/register">Sign up</Link></h5>
                        </div>
                        <div className="inputs">
                            <label className="inp1" htmlFor="email">Email</label>
                            <input type="email" name="email" className="user-input" id="email" required onChange={handleChange} value={formData.email} disabled={loading} />
                        </div>
                        <div className="inputs">
                            <label className="inp2" htmlFor="password">Password</label>
                            <input type="password" name="password" className="user-password" id="password" required onChange={handleChange} value={formData.password} disabled={loading} />
                        </div>
                        
                        <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '15px' }}>
                            <Link to="/forgot-password" style={{ fontSize: '14px', color: '#007bff', textDecoration: 'none' }}>Forgot Password?</Link>
                        </div>
                        
                        <button type="submit" className="Login" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;
