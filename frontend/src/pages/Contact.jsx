import React, { useState } from 'react';
import '../css/global.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        fname: '', lname: '', email: '', phone: '', choice: '', msg: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank You! We will reach out to you soon.');
    };

    return (
        <section className="main">
            <div className="contact-box">
                <div className="form-content">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="firstname">First Name</label>
                                <input type="text" name="fname" className="form-control" id="firstname" placeholder="First name" required onChange={handleChange} />
                            </div>
                            <div className="col">
                                <label htmlFor="lastname">Last Name</label>
                                <input type="text" name="lname" className="form-control" id="lastname" placeholder="Last name" required onChange={handleChange} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <label htmlFor="email"> Email Id: </label>
                                <input type="email" name="email" className="form-control" id="email" placeholder="Email Id" required onChange={handleChange} />
                            </div>
                            <div className="col">
                                <label htmlFor="contact"> Contact No:</label>
                                <input type="text" name="phone" className="form-control" id="contact" placeholder="10 Digit Number" pattern="[0-9]{10}" title="Must be exactly 10 digits" required onChange={handleChange} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <label> Are you an existing client? </label> <br />
                                <input type="radio" id="yes" name="choice" value="yes" required onChange={handleChange} />
                                <label className="radio-btn" htmlFor="yes"> Yes </label>
                                <input type="radio" id="no" name="choice" value="no" required onChange={handleChange} />
                                <label htmlFor="no"> No </label>
                            </div>
                        </div>

                        <br />
                        <div className="form-row textarea">
                            <div className="input-data">
                                <label htmlFor="msg"> Your Message: </label> <br />
                                <textarea id="msg" name="msg" cols="80" rows="5" placeholder="Enter Your Message" required onChange={handleChange}></textarea>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-last col">
                                <button type="submit" id="btn" className="btn">
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
