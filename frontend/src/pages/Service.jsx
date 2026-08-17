import React from 'react';
import { Link } from 'react-router-dom';
import '../css/style_service.css';

const Service = () => {
    return (
        <div className="service-page">
            <div className="service-hero">
                <h1>Our Services</h1>
                <p>Join the movement. Whether you have food to share or need a meal, FeedAid connects you instantly.</p>
            </div>

            <div className="service-cards-grid">
                <Link to="/donor" className="service-link">
                    <div className="service-card">
                        <div className="service-card-icon">ðŸ±</div>
                        <h3 className="service-title">Donor</h3>
                        <p className="service-desc">
                            Have extra food? List your surplus meals and connect with receivers who need them most.
                            Every donation counts.
                        </p>
                        <span className="service-cta">Start Donating â†’</span>
                    </div>
                </Link>

                <Link to="/receiver" className="service-link">
                    <div className="service-card">
                        <div className="service-card-icon">ðŸ¤²</div>
                        <h3 className="service-title">Receiver</h3>
                        <p className="service-desc">
                            Browse available food donations near you and claim what you need. Simple, fast, and
                            completely free.
                        </p>
                        <span className="service-cta">Find Food â†’</span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Service;
