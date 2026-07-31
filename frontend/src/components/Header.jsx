import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/navbar.css';

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            setUser(JSON.parse(localStorage.getItem('user')));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <header>
            <nav>
                <div className="nav-container-mobile">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div className="logo-text">Feed Aid<span style={{color: '#f27221'}}>.</span></div>
                    </Link>
                    <button className="hamburger-btn" onClick={toggleMenu}>
                        <svg viewBox="0 0 100 80" width="25" height="25" fill="#333">
                            <rect width="100" height="15" rx="8"></rect>
                            <rect y="30" width="100" height="15" rx="8"></rect>
                            <rect y="60" width="100" height="15" rx="8"></rect>
                        </svg>
                    </button>
                </div>
                <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    <ul className="nav-list1">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/service">Service</Link></li>
                        <li><Link to="/leaderboard">Leaderboard</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                    </ul>
                    <ul className="nav-list2">
                        {user ? (
                            <li><Link to="/profile" style={{color: '#f27221', fontWeight: 'bold'}}>Profile</Link></li>
                        ) : (
                            <>
                                <li><Link to="/register">Register</Link></li>
                                <li><Link to="/login">Login</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
