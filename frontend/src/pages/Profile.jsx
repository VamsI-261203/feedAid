import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/global.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [donations, setDonations] = useState([]);
    const [claims, setClaims] = useState([]);
    const [donorClaims, setDonorClaims] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedInUser) {
            navigate('/login');
            return;
        }
        setUser(loggedInUser);

        // Fetch User History
        const fetchHistory = async () => {
            try {
                const email = loggedInUser.email;
                const donorRes = await axios.get(`http://localhost:8080/api/donors/history?email=${email}`);
                setDonations(donorRes.data);

                const receiverRes = await axios.get(`http://localhost:8080/api/receivers/history?email=${email}`);
                setClaims(receiverRes.data);

                const donorClaimsRes = await axios.get(`http://localhost:8080/api/receivers/claims/donor?email=${email}`);
                setDonorClaims(donorClaimsRes.data);
            } catch (error) {
                console.error("Error fetching history", error);
            }
        };
        fetchHistory();
    }, [navigate]);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    // Calculate total points based on donations
    // Using 10 points per 1 quantity donated as per leaderboard logic
    const totalPoints = donations.reduce((total, d) => total + (d.initialQuantity * 10 || d.quantity * 10), 0);

    return (
        <section className="main" style={{ padding: '40px 5%', minHeight: '80vh' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '2.5rem', color: '#f27221' }}>Hello, {user.name}</h2>
                    <button onClick={handleLogout} className="btn" style={{ padding: '10px 25px', backgroundColor: '#e03a55', borderColor: '#e03a55', marginTop: 0 }}>Logout</button>
                </div>

                <div style={{ backgroundColor: '#fff', borderRadius: '15px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '30px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <h3 style={{ color: '#555', fontSize: '1.2rem', margin: '0 0 10px 0' }}>Total Impact Points</h3>
                        <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#f27221', margin: 0 }}>{totalPoints}</p>
                    </div>
                    <div style={{ flex: 1, borderLeft: '1px solid #eee', paddingLeft: '30px', minWidth: '200px' }}>
                        <h3 style={{ color: '#555', fontSize: '1.2rem', margin: '0 0 10px 0' }}>Food Donated</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', margin: 0 }}>{donations.length} <span style={{fontSize: '1rem', fontWeight: 'normal'}}>times</span></p>
                    </div>
                    <div style={{ flex: 1, borderLeft: '1px solid #eee', paddingLeft: '30px', minWidth: '200px' }}>
                        <h3 style={{ color: '#555', fontSize: '1.2rem', margin: '0 0 10px 0' }}>Food Claimed</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', margin: 0 }}>{claims.length} <span style={{fontSize: '1rem', fontWeight: 'normal'}}>times</span></p>
                    </div>
                </div>

                <h3 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '20px' }}>Your Donation History</h3>
                {donations.length === 0 ? (
                    <p style={{ color: '#777', fontStyle: 'italic', marginBottom: '30px' }}>You haven't made any donations yet.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                        {donations.map((d, index) => (
                            <div key={index} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                <h4 style={{ color: '#f27221', margin: '0 0 10px 0', fontSize: '1.2rem' }}>{d.itemName || 'Food Item'}</h4>
                                <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#555' }}><strong>Type:</strong> {d.choice} ({d.type})</p>
                                <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#555' }}><strong>Quantity:</strong> {d.initialQuantity || d.quantity} people</p>
                                <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#555' }}><strong>Status:</strong> {d.quantity === 0 ? 'Fully Claimed' : 'Available/Partial'}</p>
                                <p style={{ margin: '0 0 0 0', fontSize: '0.8rem', color: '#999' }}>{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Recent'}</p>
                            </div>
                        ))}
                    </div>
                )}

                <h3 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '20px', marginTop: '30px' }}>Claims on Your Donations</h3>
                {donorClaims.length === 0 ? (
                    <p style={{ color: '#777', fontStyle: 'italic', marginBottom: '30px' }}>No claims have been made on your donations yet.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                        {donorClaims.map((c, index) => (
                            <div key={index} style={{
                                backgroundColor: '#fff', borderRadius: '10px', padding: '20px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column',
                                border: c.status === 'DELIVERED' ? '2px solid #28a745' : '1px solid #eee'
                            }}>
                                <h4 style={{ color: '#f27221', margin: '0 0 10px 0', fontSize: '1.2rem' }}>{c.donor?.itemName || 'Food Item'}</h4>
                                <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#555' }}><strong>Receiver Name:</strong> {c.receiver?.name}</p>
                                <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#555' }}><strong>Receiver Contact:</strong> {c.receiver?.contact}</p>
                                <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#555' }}><strong>Quantity Claimed:</strong> {c.quantityClaimed} pack{c.quantityClaimed > 1 ? 's' : ''}</p>
                                <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#555' }}>
                                    <strong>Status:</strong>{' '}
                                    <span style={{
                                        display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                                        backgroundColor: c.status === 'DELIVERED' ? '#d4edda' : '#fff3cd',
                                        color: c.status === 'DELIVERED' ? '#155724' : '#856404'
                                    }}>
                                        {c.status === 'DELIVERED' ? 'Delivered ✓' : 'Accepted'}
                                    </span>
                                </p>

                                <button
                                    onClick={() => navigate(`/chat/${c.chatRoomId}`)}
                                    className="btn"
                                    style={{
                                        marginTop: 'auto', padding: '10px 20px', border: '1px solid #f27221', borderRadius: '8px',
                                        fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                                        backgroundColor: '#fff', color: '#f27221', transition: 'all 0.3s',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                    }}
                                >
                                    💬 {c.status === 'DELIVERED' ? 'View Chat (Read-Only)' : 'Open Chat'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <h3 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '20px' }}>Your Claim History</h3>
                {claims.length === 0 ? (
                    <p style={{ color: '#777', fontStyle: 'italic' }}>You haven't claimed any food yet.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {claims.map((c, index) => (
                            <div key={index} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                <h4 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '1.2rem' }}>Food Request</h4>
                                <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#555' }}><strong>Requested for:</strong> {c.quantity} people</p>
                                <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#555' }}><strong>Location:</strong> {c.city}, {c.zipcode}</p>
                                <p style={{ margin: '0 0 0 0', fontSize: '0.8rem', color: '#999' }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recent'}</p>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
};

export default Profile;
