import React from 'react';
import { Link } from 'react-router-dom';
import '../css/footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <div className="footer-logo">Feed Aid<span>.</span></div>
                    <p className="footer-tagline">
                        Connecting surplus food with those who need it most — reducing waste, fighting hunger.
                    </p>
                </div>
                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/service">Services</Link></li>
                        <li><Link to="/leaderboard">Leaderboard</Link></li>
                        <li><Link to="/reviews">Reviews</Link></li>
                    </ul>
                </div>
                <div className="footer-links">
                    <h4>Account</h4>
                    <ul>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-bottom-inner">
                    <p>© 2026 Feed Aid. All rights reserved.</p>
                    <p className="footer-made">Made with ❤️ to fight hunger</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

