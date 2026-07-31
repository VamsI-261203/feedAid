import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/global.css';

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
            <div className="login-box">
                <div className="form-content">
                    <form onSubmit={handleSubmit} className="form-inputs">
                        <div className="row">
                            <div className="col">
                                <label htmlFor="name">Name</label>
                                <input type="text" name="name" className="form-control" id="name" placeholder="Name" required onChange={handleChange} value={formData.name} disabled={loading} />
                            </div>
                            <div className="col">
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" className="form-control" id="email" placeholder="Email" required onChange={handleChange} value={formData.email} disabled={loading} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" className="form-control" id="password" placeholder="Password (Min 8 chars, 1 Upper, 1 Special)" required onChange={handleChange} value={formData.password} disabled={loading} />
                            </div>
                            <div className="col">
                                <label htmlFor="phone">Phone</label>
                                <input type="text" name="phone" className="form-control" id="phone" placeholder="10 Digit Number" pattern="[0-9]{10}" title="Must be exactly 10 digits" required onChange={handleChange} value={formData.phone} disabled={loading} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-last col">
                                <button type="submit" id="last-btn" className="form-button btn btn-success submit-btn" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                                    {loading ? 'Processing...' : 'Sign up'}
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="register-img-container">
                        <img src="/img/register1.png" alt="Signu-Img" className="register-img" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
