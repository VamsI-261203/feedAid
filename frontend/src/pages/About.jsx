import React from 'react';
import { Link } from 'react-router-dom';
import '../css/style_about.css';

const About = () => {
    return (
        <div className="about-page-main">
            
            {/* 1. HERO SECTION */}
            <section className="about-hero-section">
                <div className="about-hero-content">
                    <span className="about-hero-tag">Who We Are</span>
                    <h1 className="about-hero-title">About FeedAid</h1>
                    <p className="about-hero-desc">
                        A modern, smart platform dedicated to reducing food wastage and connecting surplus meals to those who need them most.
                    </p>
                </div>
            </section>

            {/* 2. OUR MISSION */}
            <section className="about-section-container">
                <div className="about-mission-grid">
                    <div className="about-mission-text">
                        <h2 className="about-mission-heading">Our Mission & Purpose</h2>
                        <p className="about-mission-paragraph">
                            Each year, millions of tons of nutritious food are thrown away, while thousands of people go to sleep hungry. FeedAid was created to bridge this gap. 
                        </p>
                        <p className="about-mission-paragraph">
                            By leveraging technology, we create a secure, direct, and real-time link between generous food donors and verified community receivers. Our platform helps organizations, restaurants, and individuals share extra food instead of discarding it.
                        </p>
                        <div className="about-mission-quote-card">
                            <p className="about-mission-quote-text">
                                "Saving food isn't just about charity; it's about building a sustainable and compassionate ecosystem for our future."
                            </p>
                            <span className="about-mission-quote-author">FeedAid Team</span>
                        </div>
                    </div>
                    <div className="about-mission-illustration">
                        <div className="about-mission-photo-frame">
                            <img src="/img/about-img.png" className="about-mission-photo" alt="People sharing food" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. HOW FEEDAID WORKS (TIMELINE) */}
            <section className="about-section-container" style={{ background: '#ffffff', borderRadius: '30px' }}>
                <h2 className="about-section-title">How FeedAid Works</h2>
                <p className="about-section-subtitle">
                    Our platform streamlines the donation process into 6 simple, secure steps.
                </p>
                
                <div className="about-timeline">
                    <div className="about-timeline-item left">
                        <div className="about-timeline-content">
                            <span className="about-timeline-badge">Step 1</span>
                            <h3 className="about-timeline-title">Donor Registers</h3>
                            <p className="about-timeline-desc">
                                Donors sign up with email verification. They secure their account using verified contact numbers.
                            </p>
                        </div>
                    </div>

                    <div className="about-timeline-item right">
                        <div className="about-timeline-content">
                            <span className="about-timeline-badge">Step 2</span>
                            <h3 className="about-timeline-title">Donor Posts Food</h3>
                            <p className="about-timeline-desc">
                                The donor fills out a simple form specifying food item details, quantity, expiry time, and pickup address.
                            </p>
                        </div>
                    </div>

                    <div className="about-timeline-item left">
                        <div className="about-timeline-content">
                            <span className="about-timeline-badge">Step 3</span>
                            <h3 className="about-timeline-title">Receiver Claims Food</h3>
                            <p className="about-timeline-desc">
                                Receivers browse active local donations and claim the required quantity to support their community.
                            </p>
                        </div>
                    </div>

                    <div className="about-timeline-item right">
                        <div className="about-timeline-content">
                            <span className="about-timeline-badge">Step 4</span>
                            <h3 className="about-timeline-title">Real-Time Coordination</h3>
                            <p className="about-timeline-desc">
                                A private chat room is automatically opened for the donor and receiver to coordinate pickup details.
                            </p>
                        </div>
                    </div>

                    <div className="about-timeline-item left">
                        <div className="about-timeline-content">
                            <span className="about-timeline-badge">Step 5</span>
                            <h3 className="about-timeline-title">Food Collection</h3>
                            <p className="about-timeline-desc">
                                The receiver picks up the food from the donor's shared location coordinates securely.
                            </p>
                        </div>
                    </div>

                    <div className="about-timeline-item right">
                        <div className="about-timeline-content">
                            <span className="about-timeline-badge">Step 6</span>
                            <h3 className="about-timeline-title">Donation Completed</h3>
                            <p className="about-timeline-desc">
                                Delivery is confirmed, and the chat room is safely locked down to secure user privacy.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. WHY CHOOSE FEEDAID */}
            <section className="about-section-container">
                <h2 className="about-section-title">Why Choose FeedAid</h2>
                <p className="about-section-subtitle">
                    A secure and seamless platform engineered for transparent food coordination.
                </p>

                <div className="about-features-grid">
                    <div className="about-feature-card">
                        <div className="about-feature-icon">🔒</div>
                        <h3 className="about-feature-title">Secure Auth</h3>
                        <p className="about-feature-desc">
                            All user credentials and tokens are safeguarded using industry standard hashing.
                        </p>
                    </div>

                    <div className="about-feature-card">
                        <div className="about-feature-icon">✉️</div>
                        <h3 className="about-feature-title">Email OTP Check</h3>
                        <p className="about-feature-desc">
                            Ensures account authenticity with verified OTP codes sent during registration.
                        </p>
                    </div>

                    <div className="about-feature-card">
                        <div className="about-feature-icon">💬</div>
                        <h3 className="about-feature-title">Real-Time Chat</h3>
                        <p className="about-feature-desc">
                            STOMP WebSocket chat rooms connect donor and receiver instantly.
                        </p>
                    </div>

                    <div className="about-feature-card">
                        <div className="about-feature-icon">⚡</div>
                        <h3 className="about-feature-title">Fast Donation</h3>
                        <p className="about-feature-desc">
                            Quick posting and claiming forms publish active claims instantly.
                        </p>
                    </div>

                    <div className="about-feature-card">
                        <div className="about-feature-icon">🌍</div>
                        <h3 className="about-feature-title">Community Support</h3>
                        <p className="about-feature-desc">
                            Helping NGOs, orphanages, and families access quality food easily.
                        </p>
                    </div>

                    <div className="about-feature-card">
                        <div className="about-feature-icon">💡</div>
                        <h3 className="about-feature-title">Easy to Use</h3>
                        <p className="about-feature-desc">
                            Minimal, clean card dashboards optimized for desktop and mobile devices.
                        </p>
                    </div>
                </div>
            </section>

            {/* 5. OUR VALUES */}
            <section className="about-section-container" style={{ background: '#ffffff', borderRadius: '30px' }}>
                <h2 className="about-section-title">Our Core Values</h2>
                <p className="about-section-subtitle">
                    The beliefs and principles that drive our project forward every day.
                </p>

                <div className="about-values-grid">
                    <div className="about-value-card">
                        <div className="about-value-icon">🤝</div>
                        <h3 className="about-value-title">Compassion</h3>
                        <p className="about-value-desc">
                            Empathizing with those in need and taking direct action to help them.
                        </p>
                    </div>

                    <div className="about-value-card">
                        <div className="about-value-icon">💎</div>
                        <h3 className="about-value-title">Trust</h3>
                        <p className="about-value-desc">
                            Maintaining honesty, verification, and transparency across our community.
                        </p>
                    </div>

                    <div className="about-value-card">
                        <div className="about-value-icon">🌱</div>
                        <h3 className="about-value-title">Sustainability</h3>
                        <p className="about-value-desc">
                            Reducing environment footprints by preventing landfill food decay.
                        </p>
                    </div>

                    <div className="about-value-card">
                        <div className="about-value-icon">🏘️</div>
                        <h3 className="about-value-title">Community</h3>
                        <p className="about-value-desc">
                            Fostering collaboration between citizens, NGOs, and food businesses.
                        </p>
                    </div>
                </div>
            </section>

            {/* 6. CALL TO ACTION */}
            <section className="about-section-container">
                <div className="about-cta-section">
                    <h2 className="about-cta-title">Ready to Make an Impact?</h2>
                    <p className="about-cta-desc">
                        Join FeedAid today. Share extra meals as a Donor or claim available food requests as a Receiver.
                    </p>
                    <div className="about-cta-buttons">
                        <Link to="/login" className="about-btn primary">
                            Become a Donor ➜
                        </Link>
                        <Link to="/login" className="about-btn secondary">
                            Become a Receiver ➜
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;
