import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/global.css';

const Donor = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', contact: '', choice: '', type: '', expiryDate: '',
        quantity: '', address: '', city: '', state: '', zipcode: '', future: '',
        itemName: '', photoBase64: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photoBase64: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                quantity: parseInt(formData.quantity, 10)
            };
            await axios.post('http://localhost:8080/api/donors', payload);
            navigate('/leaderboard');
            // Reset form if needed
            setFormData({
                name: '', email: '', contact: '', choice: '', type: '', expiryDate: '',
                quantity: '', address: '', city: '', state: '', zipcode: '', future: '',
                itemName: '', photoBase64: ''
            });
        } catch (error) {
            console.error('Error submitting donation:', error);
            alert('Failed to submit donation. Please try again.');
        }
    };

    return (
        <section className="main">
            <div className="contact-box">
                <div className="form-content">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="name"> Name:</label>
                                <input type="text" name="name" className="form-control" id="name" placeholder="Name" required value={formData.name} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="email"> Email:</label>
                                <input type="text" name="email" className="form-control" id="email" placeholder="Email id" required value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="col">
                                <label htmlFor="contact"> Contact:</label>
                                <input type="text" name="contact" className="form-control" id="contact" placeholder="10 Digit Contact No" pattern="[0-9]{10}" title="Must be exactly 10 digits" required value={formData.contact} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <label htmlFor="itemName"> Item Name:</label>
                                <input type="text" name="itemName" className="form-control" id="itemName" placeholder="e.g. 50 Boxes of Pizza" required value={formData.itemName} onChange={handleChange} />
                            </div>
                            <div className="col">
                                <label htmlFor="photo"> Item Photo:</label>
                                <input type="file" name="photo" className="form-control" id="photo" accept="image/*" required onChange={handlePhotoChange} style={{padding: '5px'}} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <label> Choose your preference: </label> <br />
                                <input type="radio" id="veg" name="choice" value="veg" required checked={formData.choice === 'veg'} onChange={handleChange} />
                                <label className="radio-btn" htmlFor="veg"> Veg </label>
                                <input type="radio" id="nonveg" name="choice" value="nonveg" required checked={formData.choice === 'nonveg'} onChange={handleChange} />
                                <label htmlFor="nonveg"> Non-Veg </label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <label> Which type of food are you donating? </label> <br />
                                <input type="radio" id="packed" name="type" value="packed" required checked={formData.type === 'packed'} onChange={handleChange} />
                                <label className="radio-btn" htmlFor="packed"> Packed </label>
                                <input type="radio" id="cooked" name="type" value="cooked" required checked={formData.type === 'cooked'} onChange={handleChange} />
                                <label htmlFor="cooked"> Cooked </label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <label htmlFor="freshness"> What is the expiration date of this food? </label> <br />
                                <input type="date" name="expiryDate" className="form-control" id="freshness" min={new Date().toISOString().split('T')[0]} required value={formData.expiryDate} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-row textarea row">
                            <div className="input-data col">
                                <label htmlFor="quantity"> For how many people is the quantity of food sufficient? </label> <br />
                                <input type="number" name="quantity" className="form-control" id="quantity" min="1" placeholder="Quantity sufficient for how many people" required value={formData.quantity} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <label htmlFor="address"> Address:</label>
                                <input type="text" name="address" className="form-control" id="address" placeholder="Enter your address" required value={formData.address} onChange={handleChange} />
                            </div>
                            <div className="col">
                                <label htmlFor="city"> City:</label>
                                <input type="text" name="city" className="form-control" id="city" placeholder="Enter your city" required value={formData.city} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <label htmlFor="state"> State:</label>
                                <input type="text" name="state" className="form-control" id="state" placeholder="State" required value={formData.state} onChange={handleChange} />
                            </div>
                            <div className="col">
                                <label htmlFor="zipcode"> Zip Code:</label>
                                <input type="text" name="zipcode" className="form-control" id="zipcode" placeholder="Zip Code" pattern="[0-9]{5,6}" title="Must be 5 or 6 digits" required value={formData.zipcode} onChange={handleChange} />
                            </div>
                        </div>



                        <div className="row">
                            <div className="col">
                                <label> Are you willing to donate in future as well? </label> <br />
                                <input type="radio" id="yes2" name="future" value="yes" required checked={formData.future === 'yes'} onChange={handleChange} />
                                <label className="radio-btn" htmlFor="yes2"> Yes </label>
                                <input type="radio" id="no2" name="future" value="no" required checked={formData.future === 'no'} onChange={handleChange} />
                                <label htmlFor="no2"> No </label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-last col">
                                <button type="submit" id="btn" className="btn">
                                    Donate Now
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Donor;
