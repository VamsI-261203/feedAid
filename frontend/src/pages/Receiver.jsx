import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/global.css';

const Receiver = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', contact: '', choice: '', quantity: '', address: '', city: '', state: '', zipcode: ''
    });
    const [availableDonors, setAvailableDonors] = useState(null);
    const [searchMessage, setSearchMessage] = useState(null);
    const [claimMessage, setClaimMessage] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchMessage(null);
        try {
            const quantity = parseInt(formData.quantity, 10);
            const response = await axios.get(`http://localhost:8080/api/donors/search?city=${formData.city}&choice=${formData.choice}&quantity=${quantity}`);
            if (response.data.length === 0) {
                setSearchMessage("Currently not available in this location, try after some time.");
                setAvailableDonors(null);
            } else {
                setAvailableDonors(response.data);
            }
        } catch (error) {
            console.error('Error searching donors:', error);
            setSearchMessage('Failed to search available food. Please try again.');
        }
    };

    const handleClaim = async (donorId) => {
        try {
            const payload = {
                ...formData,
                quantity: parseInt(formData.quantity, 10)
            };
            const response = await axios.post(`http://localhost:8080/api/receivers/claim/${donorId}`, payload);
            setClaimMessage(response.data);
        } catch (error) {
            console.error('Error claiming food:', error);
            alert(error.response?.data || 'Failed to claim. The food might be unavailable.');
        }
    };

    return (
        <section className="main" style={{ minHeight: '80vh', padding: '40px 5%' }}>
            {claimMessage ? (
                <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <h2 style={{ color: '#28a745', marginBottom: '20px', fontSize: '2rem' }}>Success!</h2>
                    <div style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.6', whiteSpace: 'pre-line', textAlign: 'left', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
                        {claimMessage}
                    </div>
                    <button 
                        onClick={() => navigate('/')} 
                        className="btn" 
                        style={{ marginTop: '30px', padding: '12px 30px', fontSize: '1.1rem' }}
                    >
                        Return to Home
                    </button>
                </div>
            ) : availableDonors === null ? (
                <div className="contact-box">
                    <div className="form-content">
                        {searchMessage && (
                            <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', border: '1px solid #ffeeba' }}>
                                <strong>Notice:</strong> {searchMessage}
                            </div>
                        )}
                        <form onSubmit={handleSearch}>
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
                                <label> Choose your preference: </label> <br />
                                <input type="radio" id="veg" name="choice" value="veg" required checked={formData.choice === 'veg'} onChange={handleChange} />
                                <label className="radio-btn" htmlFor="veg"> Veg </label> <br />
                                <input type="radio" id="nonveg" name="choice" value="nonveg" required checked={formData.choice === 'nonveg'} onChange={handleChange} />
                                <label htmlFor="nonveg"> Non-Veg </label>
                            </div>
                        </div>

                        <div className="form-row textarea row">
                            <div className="input-data col">
                                <label htmlFor="quantity"> For how many people do you require? </label> <br />
                                <input type="number" name="quantity" className="form-control" id="quantity" min="1" placeholder="Quantity prefered" required value={formData.quantity} onChange={handleChange} />
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
                            <div className="col-last col">
                                <button type="submit" id="btn" className="btn">
                                    Search Available Food
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            ) : (
                <div className="results-container" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ color: '#f27221', fontSize: '2rem' }}>Available Food Matches</h2>
                        <button onClick={() => setAvailableDonors(null)} className="btn" style={{ padding: '10px 20px', borderRadius: '5px', marginTop: 0 }}>Back to Search</button>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                        {['All', 'veg', 'nonveg', 'packed', 'cooked'].map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '500px',
                                    border: '2px solid #f27221',
                                    backgroundColor: activeFilter === cat ? '#f27221' : 'transparent',
                                    color: activeFilter === cat ? '#fff' : '#f27221',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                        gap: '30px' 
                    }}>
                        {availableDonors
                            .filter(donor => {
                                if (activeFilter === 'All') return true;
                                if (activeFilter === 'veg' || activeFilter === 'nonveg') return donor.choice.toLowerCase() === activeFilter.toLowerCase();
                                if (activeFilter === 'packed' || activeFilter === 'cooked') return donor.type.toLowerCase() === activeFilter.toLowerCase();
                                return true;
                            })
                            .map(donor => (
                            <div key={donor.id} style={{
                                backgroundColor: '#fff',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                {donor.photoBase64 ? (
                                    <img src={donor.photoBase64} alt={donor.itemName || 'Food Item'} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '200px', backgroundColor: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                                        No Image Available
                                    </div>
                                )}
                                <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', color: '#333' }}>{donor.itemName || 'Donated Food'}</h3>
                                    <p style={{ margin: '0 0 5px 0', color: '#666' }}><strong>Type:</strong> {donor.choice} ({donor.type})</p>
                                    <p style={{ margin: '0 0 5px 0', color: '#666' }}><strong>Available For:</strong> {donor.quantity} people</p>
                                    <p style={{ margin: '0 0 15px 0', color: '#666' }}><strong>Location:</strong> {donor.city}</p>
                                    
                                    <button 
                                        onClick={() => handleClaim(donor.id)} 
                                        style={{
                                            marginTop: 'auto',
                                            backgroundColor: '#f27221',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            transition: 'background-color 0.3s'
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = '#e03a55'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = '#f27221'}
                                    >
                                        Claim this Food
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Receiver;
