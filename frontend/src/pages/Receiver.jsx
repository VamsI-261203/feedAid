import React, { useState, useEffect } from 'react';
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

    // Claims tab state
    const [activeTab, setActiveTab] = useState('search'); // 'search' or 'claims'
    const [claims, setClaims] = useState([]);
    const [claimsLoading, setClaimsLoading] = useState(false);
    const [confirmingId, setConfirmingId] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null); // claimId to confirm

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // Load claims when switching to claims tab
    useEffect(() => {
        if (activeTab === 'claims' && user?.email) {
            fetchClaims();
        }
    }, [activeTab]);

    const fetchClaims = async () => {
        if (!user?.email) return;
        setClaimsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/receivers/claims?email=${encodeURIComponent(user.email)}`);
            setClaims(response.data);
        } catch (error) {
            console.error('Error fetching claims:', error);
        } finally {
            setClaimsLoading(false);
        }
    };

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

    const handleConfirmDelivery = async (claimId) => {
        setConfirmDialog(null);
        setConfirmingId(claimId);
        try {
            const response = await axios.post(
                `http://localhost:8080/api/receivers/claims/${claimId}/confirm-delivery?email=${encodeURIComponent(user.email)}`
            );
            alert(response.data.message || 'Delivery confirmed successfully!');
            // Refresh claims list
            fetchClaims();
        } catch (error) {
            console.error('Error confirming delivery:', error);
            alert('Confirmation failed: ' + (error.response?.data?.error || 'Unknown error'));
        } finally {
            setConfirmingId(null);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            ACCEPTED: { bg: '#fff3cd', color: '#856404', border: '#ffeeba', label: '⏳ Accepted' },
            DELIVERED: { bg: '#d4edda', color: '#155724', border: '#c3e6cb', label: '✅ Delivered' },
            CANCELLED: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb', label: '❌ Cancelled' }
        };
        const s = styles[status] || styles.ACCEPTED;
        return (
            <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                backgroundColor: s.bg,
                color: s.color,
                border: `1px solid ${s.border}`
            }}>
                {s.label}
            </span>
        );
    };

    // ─────────────── RENDER ───────────────

    return (
        <section className="main" style={{ minHeight: '80vh', padding: '40px 5%' }}>

            {/* Tab Navigation */}
            <div style={{
                display: 'flex', gap: '0', marginBottom: '30px', maxWidth: '1200px', margin: '0 auto 30px auto',
                borderBottom: '2px solid #e0e0e0'
            }}>
                <button
                    onClick={() => { setActiveTab('search'); setClaimMessage(null); }}
                    style={{
                        padding: '14px 30px', border: 'none', cursor: 'pointer',
                        fontSize: '16px', fontWeight: '600', fontFamily: 'inherit',
                        backgroundColor: activeTab === 'search' ? '#fff' : 'transparent',
                        color: activeTab === 'search' ? '#f27221' : '#888',
                        borderBottom: activeTab === 'search' ? '3px solid #f27221' : '3px solid transparent',
                        transition: 'all 0.3s'
                    }}
                >
                    🔍 Find Food
                </button>
                <button
                    onClick={() => setActiveTab('claims')}
                    style={{
                        padding: '14px 30px', border: 'none', cursor: 'pointer',
                        fontSize: '16px', fontWeight: '600', fontFamily: 'inherit',
                        backgroundColor: activeTab === 'claims' ? '#fff' : 'transparent',
                        color: activeTab === 'claims' ? '#f27221' : '#888',
                        borderBottom: activeTab === 'claims' ? '3px solid #f27221' : '3px solid transparent',
                        transition: 'all 0.3s'
                    }}
                >
                    📋 My Claims
                </button>
            </div>

            {/* ───── CLAIMS TAB ───── */}
            {activeTab === 'claims' && (
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ color: '#f27221', fontSize: '1.8rem', marginBottom: '20px' }}>My Claimed Donations</h2>

                    {!user?.email ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
                            <p style={{ fontSize: '1.2rem' }}>Please log in to see your claims.</p>
                            <button onClick={() => navigate('/login')} className="btn" style={{ marginTop: '20px', padding: '12px 30px' }}>
                                Go to Login
                            </button>
                        </div>
                    ) : claimsLoading ? (
                        <div style={{ textAlign: 'center', padding: '60px' }}>
                            <div style={{
                                width: '50px', height: '50px', border: '4px solid #f0f0f0',
                                borderTop: '4px solid #f27221', borderRadius: '50%',
                                animation: 'spin 1s linear infinite', margin: '0 auto 20px'
                            }} />
                            <p style={{ color: '#888', fontSize: '1.1rem' }}>Loading your claims...</p>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                    ) : claims.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
                            <p style={{ fontSize: '3rem', marginBottom: '10px' }}>📭</p>
                            <p style={{ fontSize: '1.2rem' }}>You haven't claimed any donations yet.</p>
                            <button onClick={() => setActiveTab('search')} className="btn" style={{ marginTop: '20px', padding: '12px 30px' }}>
                                Search for Food
                            </button>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                            gap: '25px'
                        }}>
                            {claims.map(claim => (
                                <div key={claim.id} style={{
                                    backgroundColor: '#fff', borderRadius: '15px', overflow: 'hidden',
                                    boxShadow: '0 6px 20px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column',
                                    border: claim.status === 'DELIVERED' ? '2px solid #28a745' : '1px solid #eee',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}>
                                    {/* Food Image */}
                                    {claim.donor?.photoBase64 ? (
                                        <img src={claim.donor.photoBase64} alt={claim.donor.itemName || 'Food'}
                                            style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{
                                            width: '100%', height: '180px', backgroundColor: '#f3f3f3',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#999', fontSize: '14px'
                                        }}>
                                            No Image Available
                                        </div>
                                    )}

                                    {/* Card Body */}
                                    <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#333' }}>
                                                {claim.donor?.itemName || 'Donated Food'}
                                            </h3>
                                            {getStatusBadge(claim.status)}
                                        </div>

                                        <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', marginBottom: '15px' }}>
                                            <p style={{ margin: '0' }}><strong>Donor:</strong> {claim.donor?.name}</p>
                                            <p style={{ margin: '0' }}><strong>Type:</strong> {claim.donor?.choice} ({claim.donor?.type})</p>
                                            <p style={{ margin: '0' }}><strong>Quantity:</strong> {claim.quantityClaimed} pack{claim.quantityClaimed > 1 ? 's' : ''}</p>
                                            <p style={{ margin: '0' }}><strong>Location:</strong> {claim.donor?.city}</p>
                                            <p style={{ margin: '0' }}><strong>Claimed:</strong> {formatDate(claim.claimedAt)}</p>
                                            {claim.deliveredAt && (
                                                <p style={{ margin: '0', color: '#28a745' }}><strong>Delivered:</strong> {formatDate(claim.deliveredAt)}</p>
                                            )}
                                            <p style={{ margin: '0' }}><strong>Claim ID:</strong> #{claim.id}</p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div style={{ marginTop: 'auto' }}>
                                            {claim.status === 'ACCEPTED' && (
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button
                                                        onClick={() => navigate(`/chat/${claim.chatRoomId}`)}
                                                        style={{
                                                            flex: 1, padding: '12px', border: '1px solid #f27221', borderRadius: '8px',
                                                            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                                                            backgroundColor: '#fff', color: '#f27221', transition: 'all 0.3s',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                                        }}
                                                    >
                                                        💬 Chat
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDialog(claim.id)}
                                                        disabled={confirmingId === claim.id}
                                                        style={{
                                                            flex: 1.5, padding: '12px', border: 'none', borderRadius: '8px',
                                                            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                                                            backgroundColor: confirmingId === claim.id ? '#ccc' : '#28a745',
                                                            color: '#fff', transition: 'background-color 0.3s',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                                        }}
                                                    >
                                                        {confirmingId === claim.id ? 'Confirming...' : '✅ Confirm Received'}
                                                    </button>
                                                </div>
                                            )}
                                            {claim.status === 'DELIVERED' && (
                                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                                    <button
                                                        onClick={() => navigate(`/chat/${claim.chatRoomId}`)}
                                                        style={{
                                                            width: '100%', padding: '12px', border: '1px solid #999', borderRadius: '8px',
                                                            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                                                            backgroundColor: '#fff', color: '#666', transition: 'all 0.3s',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                                        }}
                                                    >
                                                        💬 View Chat (Read-Only)
                                                    </button>
                                                    <div style={{
                                                        width: '100%', padding: '12px', borderRadius: '8px',
                                                        backgroundColor: '#d4edda', color: '#155724', textAlign: 'center',
                                                        fontSize: '14px', fontWeight: '600', border: '1px solid #c3e6cb',
                                                        boxSizing: 'border-box'
                                                    }}>
                                                        ✅ Delivered — Donor Notified
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Confirmation Dialog Modal */}
            {confirmDialog && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div style={{
                        backgroundColor: '#fff', borderRadius: '16px', padding: '35px',
                        maxWidth: '420px', width: '90%', textAlign: 'center',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'fadeIn 0.2s ease-out'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📦</div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', color: '#333' }}>Confirm Delivery</h3>
                        <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.6', margin: '0 0 25px 0' }}>
                            Are you sure you want to confirm that you have received this food donation?
                            <br /><br />
                            <strong style={{ color: '#f27221' }}>The donor will be notified via email.</strong>
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={() => setConfirmDialog(null)}
                                style={{
                                    padding: '12px 28px', border: '2px solid #ddd', borderRadius: '8px',
                                    backgroundColor: '#fff', color: '#666', fontSize: '15px',
                                    fontWeight: '600', cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleConfirmDelivery(confirmDialog)}
                                style={{
                                    padding: '12px 28px', border: 'none', borderRadius: '8px',
                                    backgroundColor: '#28a745', color: '#fff', fontSize: '15px',
                                    fontWeight: '600', cursor: 'pointer'
                                }}
                            >
                                ✅ Yes, Confirm
                            </button>
                        </div>
                    </div>
                    <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }`}</style>
                </div>
            )}

            {/* ───── SEARCH TAB ───── */}
            {activeTab === 'search' && (
                <>
                    {claimMessage ? (
                        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                            <h2 style={{ color: '#28a745', marginBottom: '20px', fontSize: '2rem' }}>Success!</h2>
                            <div style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.6', whiteSpace: 'pre-line', textAlign: 'left', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
                                {claimMessage}
                            </div>
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => setActiveTab('claims')}
                                    className="btn"
                                    style={{ padding: '12px 30px', fontSize: '1.1rem', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    View My Claims
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="btn"
                                    style={{ padding: '12px 30px', fontSize: '1.1rem' }}
                                >
                                    Return to Home
                                </button>
                            </div>
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
                </>
            )}
        </section>
    );
};

export default Receiver;
