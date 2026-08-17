import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/leaderboard.css';

const Leaderboard = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/donors/leaderboard');
                setDonors(response.data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const getRankEmoji = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return index + 1;
    };

    return (
        <div className="leaderboard-page">
            {/* Hero / Podium Section */}
            <div className="leader-hero">
                <h1>Top Contributors</h1>
                <p>Celebrating the heroes who fight hunger every day</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>Loading leaderboard...</div>
            ) : (
                <>
                    <section className="medals">
                        <div className="medal-item silver">
                            <img src="/img/Silver.png" alt="Silver-Medal" className="medal-img silver-img" />
                            <div className="medal-text">
                                <h2 className="medal-name">{donors[1]?.name || 'TBA'}</h2>
                                <h4 className="medal-city">{donors[1]?.city || '—'}</h4>
                            </div>
                        </div>
                        <div className="medal-item gold">
                            <img src="/img/Gold.png" alt="Gold-Medal" className="medal-img gold-img" />
                            <div className="medal-text">
                                <h2 className="medal-name">{donors[0]?.name || 'TBA'}</h2>
                                <h4 className="medal-city">{donors[0]?.city || '—'}</h4>
                            </div>
                        </div>
                        <div className="medal-item bronze">
                            <img src="/img/Bronze.png" alt="Bronze-Medal" className="medal-img bronze-img" />
                            <div className="medal-text">
                                <h2 className="medal-name">{donors[2]?.name || 'TBA'}</h2>
                                <h4 className="medal-city">{donors[2]?.city || '—'}</h4>
                            </div>
                        </div>
                    </section>

                    <section className="leaderboard-table-section">
                        <div className="leaderboard-table-wrap">
                            <h2>Full Leaderboard</h2>
                            {donors.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">🏆</div>
                                    <p className="empty-state-text">No donors yet. Be the first to donate!</p>
                                </div>
                            ) : (
                                <table className="content-table">
                                    <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Name</th>
                                            <th>Meals Donated</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donors.map((donor, index) => (
                                            <tr key={index} className={index < 3 ? 'active-row' : ''}>
                                                <td>
                                                    <span className={`rank-badge${index < 3 ? ` rank-${index + 1}` : ''}`}>
                                                        {getRankEmoji(index)}
                                                    </span>
                                                </td>
                                                <td>{donor.name}</td>
                                                <td>{donor.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default Leaderboard;
