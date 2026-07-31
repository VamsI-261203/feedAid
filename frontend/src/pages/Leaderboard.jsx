import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/leaderboard.css';

const Leaderboard = () => {
    const [donors, setDonors] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/donors/leaderboard');
                setDonors(response.data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div>
            <section className="leader-main">
                <div className="medal-heading">
                    <center>
                        <h1>Top Contributors</h1>
                    </center>
                </div>
                <section className="medals">
                    <div className="medal-item silver">
                        <img src="/img/Silver.png" alt="Silver-Medal" className="medal-img silver-img" />
                        <div className="medal-text">
                            <h2 className="medal-name">{donors[1]?.name || 'TBA'}</h2>
                            <h4 className="medal-city">{donors[1]?.city || 'TBA'}</h4>
                        </div>
                    </div>
                    <div className="medal-item gold">
                        <img src="/img/Gold.png" alt="Gold-Medal" className="medal-img gold-img" />
                        <div className="medal-text">
                            <h2 className="medal-name">{donors[0]?.name || 'TBA'}</h2>
                            <h4 className="medal-city">{donors[0]?.city || 'TBA'}</h4>
                        </div>
                    </div>
                    <div className="medal-item bronze">
                        <img src="/img/Bronze.png" alt="Bronze-Medal" className="medal-img bronze-img" />
                        <div className="medal-text">
                            <h2 className="medal-name">{donors[2]?.name || 'TBA'}</h2>
                            <h4 className="medal-city">{donors[2]?.city || 'TBA'}</h4>
                        </div>
                    </div>
                </section>
            </section>

            <section>
                <div className="container">
                    <h2>
                        <center> Leaderboard </center>
                    </h2>
                    <section className="services">
                        <center>
                            <table className="content-table">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Name</th>
                                        <th>Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donors.map((donor, index) => (
                                        <tr key={index} className={index < 3 ? 'active-row' : ''}>
                                            <td>{index + 1}</td>
                                            <td>{donor.name}</td>
                                            <td>{donor.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </center>
                    </section>
                </div>
            </section>
        </div>
    );
};

export default Leaderboard;
