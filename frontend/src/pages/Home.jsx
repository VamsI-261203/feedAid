import React from 'react';
import '../css/style.css';

const Home = () => {
    return (
        <div>
            <section className="hero">
                <div className="hero-container">
                    <div className="hero-text">
                        <span className="hero-subtitle">Lend a hand, give a can.</span>
                        <h1>Welcome to <span>Feed Aid!</span></h1>
                        <p>
                            We are a team, keen of providing healthy meals to those who sleep empty-belly each night as well as avoiding
                            food wastage by accumulating leftover meals from people who generally used to throw away extra food and ensuring
                            it reaches those who need it.
                        </p>
                    </div>
                    <div className="hero-img-box">
                        <img src="/img/homepageimg.png" className="homeimg" alt="Pic1" />
                    </div>
                </div>
            </section>

            <section>
                <div className="mission">
                    <div className="mission-div1">
                        <img className="missionimg" src="/img/mission.png" alt="mission" />
                    </div>
                    <div className="mission-div2">
                        <h2 className="mission-heading">Our Mission</h2>
                        <br />
                        <p className="mission-para">
                            The mission of Feed Aid is to bring parity in the life of needy, making sure that every individual lives a
                            happy life by feeding them and ensuring no one sleeps empty stomach. There is no greater joy nor greater
                            reward than to make a fundamental difference in someone's life.
                        </p>
                    </div>
                </div>
            </section>

            <section className="abc">
                <div className="map-container">
                    <div className="map-header">
                        <div className="map-header-text">
                            <center>
                                <h2 className="map-header-final-text">Navigate your <br />nearest NGO</h2>
                            </center>
                        </div>
                        <div className="map-header-img">
                            <center>
                                <img src="/img/navigate2.png" alt="navigate" />
                            </center>
                        </div>
                    </div>
                    <div id="last-div">
                        <iframe 
                            title="google_map" 
                            id="final-map"
                            src="https://maps.google.com/maps?q=NGO&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                            allow="geolocation"
                            frameBorder="0" 
                            scrolling="yes" 
                            allowFullScreen
                            style={{ width: '100%', height: '400px', borderRadius: '15px' }}
                        ></iframe>
                    </div>
                </div>
            </section>
            
            <section className="testimonials">
                <div className="testimonials-container">
                    <h2 className="section-title" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '40px', color: '#1f1f25' }}>Hear From Our Receivers</h2>
                    <div className="reviews-grid">
                        <div className="review-card">
                            <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=fd4766&color=fff&size=100" alt="Sarah Jenkins" className="reviewer-img" />
                            <div className="review-content">
                                <p className="review-text">"Feed-Aid helped our local shelter secure 50 fresh meals just before the weekend. The donors were incredibly generous!"</p>
                                <h4 className="reviewer-name">- Sarah Jenkins</h4>
                                <span className="reviewer-role">Shelter Coordinator</span>
                            </div>
                        </div>
                        <div className="review-card">
                            <img src="https://ui-avatars.com/api/?name=Marcus+T&background=28a745&color=fff&size=100" alt="Marcus T" className="reviewer-img" />
                            <div className="review-content">
                                <p className="review-text">"The matching grid is so easy to use. I was able to claim exactly the vegetarian options we needed for our community event."</p>
                                <h4 className="reviewer-name">- Marcus T.</h4>
                                <span className="reviewer-role">Community Volunteer</span>
                            </div>
                        </div>
                        <div className="review-card">
                            <img src="https://ui-avatars.com/api/?name=Priya+Patel&background=1f1f25&color=fff&size=100" alt="Priya Patel" className="reviewer-img" />
                            <div className="review-content">
                                <p className="review-text">"It's heartwarming to see how much food is saved from going to waste. This platform bridges the gap perfectly."</p>
                                <h4 className="reviewer-name">- Priya Patel</h4>
                                <span className="reviewer-role">NGO Worker</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
