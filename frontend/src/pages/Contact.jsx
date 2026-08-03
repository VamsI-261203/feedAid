import React, { useState, useEffect } from 'react';
import '../css/style_contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        fname: '', lname: '', email: '', phone: '', choice: '', msg: ''
    });
    const [touched, setTouched] = useState({
        fname: false, lname: false, email: false, phone: false, choice: false, msg: false
    });
    const [errors, setErrors] = useState({
        fname: '', lname: '', email: '', phone: '', choice: '', msg: ''
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Validate form fields dynamically
    useEffect(() => {
        const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
        let fnameErr = '';
        let lnameErr = '';
        let emailErr = '';
        let phoneErr = '';
        let choiceErr = '';
        let msgErr = '';

        if (touched.fname && !formData.fname.trim()) {
            fnameErr = 'First name is required.';
        }
        if (touched.lname && !formData.lname.trim()) {
            lnameErr = 'Last name is required.';
        }
        if (touched.email) {
            if (!formData.email) {
                emailErr = 'Email address is required.';
            } else if (!emailRegex.test(formData.email)) {
                emailErr = 'Please enter a valid email address.';
            }
        }
        if (touched.phone) {
            if (!formData.phone) {
                phoneErr = 'Contact number is required.';
            } else if (!/^[0-9]{10}$/.test(formData.phone)) {
                phoneErr = 'Contact number must be exactly 10 digits.';
            }
        }
        if (touched.choice && !formData.choice) {
            choiceErr = 'Please select if you are an existing client.';
        }
        if (touched.msg && !formData.msg.trim()) {
            msgErr = 'Please enter your message.';
        }

        setErrors({
            fname: fnameErr,
            lname: lnameErr,
            email: emailErr,
            phone: phoneErr,
            choice: choiceErr,
            msg: msgErr
        });
    }, [formData, touched]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        const timer = setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 5000);
        return () => clearTimeout(timer);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Trigger all validation
        setTouched({
            fname: true,
            lname: true,
            email: true,
            phone: true,
            choice: true,
            msg: true
        });

        // Basic check before submit
        const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
        if (
            !formData.fname.trim() ||
            !formData.lname.trim() ||
            !emailRegex.test(formData.email) ||
            !/^[0-9]{10}$/.test(formData.phone) ||
            !formData.choice ||
            !formData.msg.trim()
        ) {
            showToast('Please resolve validation errors in the form.', 'error');
            return;
        }

        setLoading(true);

        // Simulate API request submission
        setTimeout(() => {
            setLoading(false);
            showToast('Thank You! We have received your message and will reach out to you soon.', 'success');
            // Reset form
            setFormData({
                fname: '', lname: '', email: '', phone: '', choice: '', msg: ''
            });
            setTouched({
                fname: false, lname: false, email: false, phone: false, choice: false, msg: false
            });
        }, 1500);
    };

    const isFormValid = 
        formData.fname && formData.lname && formData.email && formData.phone && formData.choice && formData.msg &&
        !errors.fname && !errors.lname && !errors.email && !errors.phone && !errors.choice && !errors.msg;

    return (
        <section className="main">
            {/* Toast Notification popup */}
            {toast.show && (
                <div className={`toast-notification toast-${toast.type}`} role="alert" aria-live="polite">
                    <span className="toast-icon">
                        {toast.type === 'success' ? '✅' : '❌'}
                    </span>
                    <span className="toast-message">{toast.message}</span>
                    <button className="toast-close" onClick={() => setToast(prev => ({ ...prev, show: false }))} aria-label="Close notification">×</button>
                </div>
            )}

            <div className="contact-container">
                {/* Left side: Contact Information Card */}
                <div className="contact-info-section">
                    <div className="info-header">
                        <h2>Get in Touch</h2>
                        <p>Have questions about Feed Aid? Reach out to us. We would love to help you help others.</p>
                    </div>

                    <div className="info-details-list">
                        {/* Address */}
                        <div className="info-item">
                            <div className="info-icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="info-svg">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </div>
                            <div className="info-text">
                                <h3>Address</h3>
                                <p>123 Care Street, Gachibowli,</p>
                                <p>Hyderabad, Telangana, 500032</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="info-item">
                            <div className="info-icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="info-svg">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                            </div>
                            <div className="info-text">
                                <h3>Call Us</h3>
                                <p>+91 (555) 019-2834</p>
                                <p>Mon - Fri, 9:00 AM - 6:00 PM</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="info-item">
                            <div className="info-icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="info-svg">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </div>
                            <div className="info-text">
                                <h3>Email Support</h3>
                                <p>support@feedaid.org</p>
                                <p>response within 24 hours</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side: Contact Form Card */}
                <div className="contact-form-section">
                    <form onSubmit={handleSubmit} className="contact-form-card" noValidate>
                        <div className="form-header">
                            <h2>Send Us a Message</h2>
                            <p>Fields marked with * are required.</p>
                        </div>

                        {/* Row: Name */}
                        <div className="form-grid-row">
                            <div className="form-field-group">
                                <label className="form-label" htmlFor="firstname">First Name *</label>
                                <div className="input-wrapper">
                                    <input 
                                        type="text" 
                                        name="fname" 
                                        className={`form-input-control ${touched.fname && errors.fname ? 'is-invalid' : ''} ${touched.fname && !errors.fname ? 'is-valid' : ''}`} 
                                        id="firstname" 
                                        placeholder="First name" 
                                        required 
                                        value={formData.fname}
                                        onChange={handleChange} 
                                        onBlur={() => handleBlur('fname')}
                                        disabled={loading}
                                        aria-invalid={touched.fname && errors.fname ? 'true' : 'false'}
                                    />
                                </div>
                                {touched.fname && errors.fname && <span className="field-error">{errors.fname}</span>}
                            </div>

                            <div className="form-field-group">
                                <label className="form-label" htmlFor="lastname">Last Name *</label>
                                <div className="input-wrapper">
                                    <input 
                                        type="text" 
                                        name="lname" 
                                        className={`form-input-control ${touched.lname && errors.lname ? 'is-invalid' : ''} ${touched.lname && !errors.lname ? 'is-valid' : ''}`} 
                                        id="lastname" 
                                        placeholder="Last name" 
                                        required 
                                        value={formData.lname}
                                        onChange={handleChange} 
                                        onBlur={() => handleBlur('lname')}
                                        disabled={loading}
                                        aria-invalid={touched.lname && errors.lname ? 'true' : 'false'}
                                    />
                                </div>
                                {touched.lname && errors.lname && <span className="field-error">{errors.lname}</span>}
                            </div>
                        </div>

                        {/* Row: Email / Contact */}
                        <div className="form-grid-row">
                            <div className="form-field-group">
                                <label className="form-label" htmlFor="email">Email Address *</label>
                                <div className="input-wrapper">
                                    <input 
                                        type="email" 
                                        name="email" 
                                        className={`form-input-control ${touched.email && errors.email ? 'is-invalid' : ''} ${touched.email && !errors.email ? 'is-valid' : ''}`} 
                                        id="email" 
                                        placeholder="Email Address" 
                                        required 
                                        value={formData.email}
                                        onChange={handleChange} 
                                        onBlur={() => handleBlur('email')}
                                        disabled={loading}
                                        aria-invalid={touched.email && errors.email ? 'true' : 'false'}
                                    />
                                </div>
                                {touched.email && errors.email && <span className="field-error">{errors.email}</span>}
                            </div>

                            <div className="form-field-group">
                                <label className="form-label" htmlFor="contact">Contact Number *</label>
                                <div className="input-wrapper">
                                    <input 
                                        type="text" 
                                        name="phone" 
                                        className={`form-input-control ${touched.phone && errors.phone ? 'is-invalid' : ''} ${touched.phone && !errors.phone ? 'is-valid' : ''}`} 
                                        id="contact" 
                                        placeholder="10 digit number" 
                                        required 
                                        value={formData.phone}
                                        onChange={handleChange} 
                                        onBlur={() => handleBlur('phone')}
                                        disabled={loading}
                                        aria-invalid={touched.phone && errors.phone ? 'true' : 'false'}
                                    />
                                </div>
                                {touched.phone && errors.phone && <span className="field-error">{errors.phone}</span>}
                            </div>
                        </div>

                        {/* Row: Client Choice */}
                        <div className="form-field-group">
                            <label className="form-label">Are you an existing client? *</label>
                            <div className="radio-group-container">
                                <label className="radio-label-wrapper" htmlFor="yes">
                                    <input 
                                        type="radio" 
                                        id="yes" 
                                        name="choice" 
                                        value="yes" 
                                        checked={formData.choice === 'yes'}
                                        required 
                                        onChange={handleChange} 
                                        onBlur={() => handleBlur('choice')}
                                        disabled={loading}
                                    />
                                    <span className="radio-custom"></span>
                                    Yes
                                </label>
                                <label className="radio-label-wrapper" htmlFor="no">
                                    <input 
                                        type="radio" 
                                        id="no" 
                                        name="choice" 
                                        value="no" 
                                        checked={formData.choice === 'no'}
                                        required 
                                        onChange={handleChange} 
                                        onBlur={() => handleBlur('choice')}
                                        disabled={loading}
                                    />
                                    <span className="radio-custom"></span>
                                    No
                                </label>
                            </div>
                            {touched.choice && errors.choice && <span className="field-error">{errors.choice}</span>}
                        </div>

                        {/* Row: Textarea Message */}
                        <div className="form-field-group">
                            <label className="form-label" htmlFor="msg">Your Message *</label>
                            <div className="input-wrapper">
                                <textarea 
                                    id="msg" 
                                    name="msg" 
                                    rows="4" 
                                    placeholder="Tell us how we can help..." 
                                    className={`form-textarea-control ${touched.msg && errors.msg ? 'is-invalid' : ''} ${touched.msg && !errors.msg ? 'is-valid' : ''}`}
                                    required 
                                    value={formData.msg}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('msg')}
                                    disabled={loading}
                                    aria-invalid={touched.msg && errors.msg ? 'true' : 'false'}
                                ></textarea>
                            </div>
                            {touched.msg && errors.msg && <span className="field-error">{errors.msg}</span>}
                        </div>

                        {/* Submit Button Wrapper */}
                        <div className="form-submit-container">
                            <button 
                                type="submit" 
                                className={`form-submit-btn ${loading ? 'submitting' : ''}`}
                                disabled={loading || !isFormValid}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-icon"></span>
                                        Sending...
                                    </>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
