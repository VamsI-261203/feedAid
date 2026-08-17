import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/global.css';
import '../css/profile.css';

const StatusBadge = ({ status }) => {
    if (status === 'DELIVERED') return <span className="badge badge-success">Delivered ✓</span>;
    if (status === 'ACCEPTED')  return <span className="badge badge-primary">Accepted</span>;
    return <span className="badge badge-gray">{status}</span>;
};

const Profile = () => {
    const [user, setUser] = useState(null);
    const [donations, setDonations] = useState([]);
    const [claims, setClaims] = useState([]);
    const [donorClaims, setDonorClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedInUser) {
            navigate('/login');
            return;
        }
        setUser(loggedInUser);

        const fetchHistory = async () => {
            try {
                const email = loggedInUser.email;
                const [donorRes, receiverRes, donorClaimsRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/donors/history?email=${email}`),
                    axios.get(`http://localhost:8080/api/receivers/history?email=${email}`),
                    axios.get(`http://localhost:8080/api/receivers/claims/donor?email=${email}`)
                ]);
                setDonations(donorRes.data);
                setClaims(receiverRes.data);
                setDonorClaims(donorClaimsRes.data);
            } catch (error) {
                console.error("Error fetching history", error);
            } finally {
                setLoading(false);
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

    const totalPoints = donations.reduce((total, d) => total + ((d.initialQuantity || d.quantity) * 10), 0);

    return (
        <section className="main profile-page">
            <div className="profile-container">

                {/* Header */}
                <div className="profile-header">
                    <div className="profile-avatar-wrap">
                        <div className="profile-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                        <div>
                            <h2 className="profile-greeting">Hello, {user.name} 👋</h2>
                            <p className="profile-email">{user.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="profile-logout-btn">Logout</button>
                </div>

                {/* Stats */}
                <div className="profile-stats">
                    <div className="profile-stat-card accent">
                        <span className="profile-stat-number">{totalPoints}</span>
                        <span className="profile-stat-label">Impact Points</span>
                    </div>
                    <div className="profile-stat-card">
                        <span className="profile-stat-number">{donations.length}</span>
                        <span className="profile-stat-label">Meals Donated</span>
                    </div>
                    <div className="profile-stat-card">
                        <span className="profile-stat-number">{claims.length}</span>
                        <span className="profile-stat-label">Meals Claimed</span>
                    </div>
                </div>

                {loading && (
                    <div className="profile-loading">
                        <div className="skeleton" style={{ height: 120, marginBottom: 16 }}></div>
                        <div className="skeleton" style={{ height: 120 }}></div>
                    </div>
                )}

                {/* Donation History */}
                {!loading && (
                    <>
                        <div className="profile-section">
                            <h3 className="profile-section-title">Your Donation History</h3>
                            {donations.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">🍱</div>
                                    <p className="empty-state-text">You haven't made any donations yet.</p>
                                </div>
                            ) : (
                                <div className="profile-cards-grid">
                                    {donations.map((d, index) => (
                                        <div key={index} className="profile-card">
                                            <h4 className="profile-card-title">{d.itemName || 'Food Item'}</h4>
                                            <p><span className="profile-card-label">Type:</span> {d.choice} ({d.type})</p>
                                            <p><span className="profile-card-label">Quantity:</span> {d.initialQuantity || d.quantity} people</p>
                                            <p><span className="profile-card-label">Status:</span>{' '}
                                                <span className={`badge ${d.quantity === 0 ? 'badge-success' : 'badge-primary'}`}>
                                                    {d.quantity === 0 ? 'Fully Claimed' : 'Available'}
                                                </span>
                                            </p>
                                            <p className="profile-card-date">{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Recent'}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Claims on Donor's Donations */}
                        <div className="profile-section">
                            <h3 className="profile-section-title">Claims on Your Donations</h3>
                            {donorClaims.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">📭</div>
                                    <p className="empty-state-text">No claims have been made on your donations yet.</p>
                                </div>
                            ) : (
                                <div className="profile-cards-grid">
                                    {donorClaims.map((c, index) => (
                                        <div key={index} className={`profile-card ${c.status === 'DELIVERED' ? 'profile-card-delivered' : ''}`}>
                                            <h4 className="profile-card-title">{c.donor?.itemName || 'Food Item'}</h4>
                                            <p><span className="profile-card-label">Receiver:</span> {c.receiver?.name}</p>
                                            <p><span className="profile-card-label">Contact:</span> {c.receiver?.contact}</p>
                                            <p><span className="profile-card-label">Claimed:</span> {c.quantityClaimed} pack{c.quantityClaimed > 1 ? 's' : ''}</p>
                                            <p><span className="profile-card-label">Status:</span> <StatusBadge status={c.status} /></p>
                                            <button
                                                onClick={() => navigate(`/chat/${c.chatRoomId}`)}
                                                className="profile-chat-btn"
                                            >
                                                💬 {c.status === 'DELIVERED' ? 'View Chat' : 'Open Chat'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Claim History */}
                        <div className="profile-section">
                            <h3 className="profile-section-title">Your Claim History</h3>
                            {claims.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">🛒</div>
                                    <p className="empty-state-text">You haven't claimed any food yet.</p>
                                </div>
                            ) : (
                                <div className="profile-cards-grid">
                                    {claims.map((c, index) => (
                                        <div key={index} className="profile-card">
                                            <h4 className="profile-card-title">Food Request</h4>
                                            <p><span className="profile-card-label">For:</span> {c.quantity} people</p>
                                            <p><span className="profile-card-label">Location:</span> {c.city}, {c.zipcode}</p>
                                            <p className="profile-card-date">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recent'}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

            </div>
        </section>
    );
};

export default Profile;
