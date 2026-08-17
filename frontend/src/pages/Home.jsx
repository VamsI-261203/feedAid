import React from 'react';
import '../css/style.css';

const Home = () => {
    return (
        <div>
            {/* 1. HERO SECTION */}
            <section className="hero">
                <div className="hero-container">
                    <div className="hero-text">
                        <span className="hero-subtitle">Lend a hand, give a can.</span>
                        <h1>Welcome to <span>Feed Aid!</span></h1>
                        <p>
                            We connect generous donors with those who need it most â€” turning surplus food into
                            life-changing meals, reducing waste and fighting hunger one plate at a time.
                        </p>
                    </div>
                    <div className="hero-img-box">
                        <img src="/img/homepageimg.png" className="homeimg" alt="Food sharing illustration" />
                    </div>
                </div>
            </section>

            {/* 2. STATS BAR */}
            <section className="home-stats-bar">
                <div className="stats-inner">
                    <div className="stat-item">
                        <span className="stat-number">500+</span>
                        <span className="stat-label">Meals Delivered</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">120+</span>
                        <span className="stat-label">Active Donors</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">15+</span>
                        <span className="stat-label">NGOs Supported</span>
                    </div>
                </div>
            </section>

            {/* 3. MISSION SECTION */}
            <section>
                <div className="mission">
                    <div className="mission-div1">
                        <img className="missionimg" src="/img/mission.png" alt="Our mission illustration" />
                    </div>
                    <div className="mission-div2">
                        <span className="mission-label">Our Mission</span>
                        <h2 className="mission-heading">Making Sure No One Sleeps Hungry</h2>
                        <p className="mission-para">
                            The mission of Feed Aid is to bring parity in the life of those in need, making sure that
                            every individual lives a happy life by feeding them and ensuring no one sleeps on an empty
                            stomach. There is no greater joy nor greater reward than to make a fundamental difference
                            in someone's life.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. MAP SECTION */}
            <section className="abc">
                <div className="map-container">
                    <div className="map-header">
                        <div className="map-header-text">
                            <h2 className="map-header-final-text">Navigate your<br />nearest NGO</h2>
                        </div>
                        <div className="map-header-img">
                            <img src="/img/navigate2.png" alt="Map navigation icon" />
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
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* 5. TESTIMONIALS */}
            <section className="testimonials">
                <div className="testimonials-container">
                    <h2 className="section-title">Hear From Our Community</h2>
                    <p className="testimonials-subtitle">Real stories from donors and receivers making a difference every day.</p>
                    <div className="reviews-grid">
                        <div className="review-card">
                            <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=f27221&color=fff&size=100" alt="Sarah Jenkins" className="reviewer-img" />
                            <div className="review-content">
                                <p className="review-text">"Feed-Aid helped our local shelter secure 50 fresh meals just before the weekend. The donors were incredibly generous!"</p>
                                <h4 className="reviewer-name">Sarah Jenkins</h4>
                                <span className="reviewer-role">Shelter Coordinator</span>
                            </div>
                        </div>
                        <div className="review-card">
                            <img src="https://ui-avatars.com/api/?name=Marcus+T&background=22c55e&color=fff&size=100" alt="Marcus T" className="reviewer-img" />
                            <div className="review-content">
                                <p className="review-text">"The matching system is so easy to use. I was able to claim exactly the vegetarian options we needed for our community event."</p>
                                <h4 className="reviewer-name">Marcus T.</h4>
                                <span className="reviewer-role">Community Volunteer</span>
                            </div>
                        </div>
                        <div className="review-card">
                            <img src="https://ui-avatars.com/api/?name=Priya+Patel&background=1f2937&color=fff&size=100" alt="Priya Patel" className="reviewer-img" />
                            <div className="review-content">
                                <p className="review-text">"It's heartwarming to see how much food is saved from going to waste. This platform bridges the gap perfectly."</p>
                                <h4 className="reviewer-name">Priya Patel</h4>
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
