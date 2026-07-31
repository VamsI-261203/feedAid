import React from 'react';
import { Link } from 'react-router-dom';
import '../css/style_service.css';

const Service = () => {
    return (
        <section className="main">
            <div className="container">
                <h2 style={{ marginTop: '0' }}>Our Services</h2>

                <section className="services">
                    <Link to="/donor" className="service-link">
                        <div className="service-card">
                            <h3 className="service-title">Donor</h3>
                            <img className="service-img" src="/img/Donor.png" alt="Donor" />
                        </div>
                    </Link>
                    <Link to="/receiver" className="service-link">
                        <div className="service-card">
                            <h3 className="service-title">Receiver</h3>
                            <img className="service-img" src="/img/Receiver.png" alt="Receiver" />
                        </div>
                    </Link>
                </section>
            </div>
        </section>
    );
};

export default Service;
