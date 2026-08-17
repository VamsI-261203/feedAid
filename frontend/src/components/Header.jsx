import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../css/navbar.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            setUser(JSON.parse(localStorage.getItem('user')));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
            <nav className="nav-inner">
                <div className="nav-left">
                    <Link to="/" className="nav-logo">
                        Feed Aid<span className="nav-logo-dot">.</span>
                    </Link>
                </div>

                <div className={`nav-links${isMenuOpen ? ' open' : ''}`}>
                    <ul className="nav-list">
                        <li><Link to="/" className={`nav-link${isActive('/') ? ' active' : ''}`}>Home</Link></li>
                        <li><Link to="/about" className={`nav-link${isActive('/about') ? ' active' : ''}`}>About</Link></li>
                        <li><Link to="/service" className={`nav-link${isActive('/service') ? ' active' : ''}`}>Services</Link></li>
                        <li><Link to="/leaderboard" className={`nav-link${isActive('/leaderboard') ? ' active' : ''}`}>Leaderboard</Link></li>
                        <li><Link to="/reviews" className={`nav-link${isActive('/reviews') ? ' active' : ''}`}>Reviews</Link></li>
                    </ul>
                    <ul className="nav-auth">
                        {user ? (
                            <>
                                <li>
                                    <Link to="/profile" className="nav-link nav-profile">
                                        <span className="nav-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                                        {user.name?.split(' ')[0]}
                                    </Link>
                                </li>
                                <li>
                                    <button className="nav-btn-outline" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login" className="nav-btn-outline">Login</Link></li>
                                <li><Link to="/register" className="nav-btn-filled">Get Started</Link></li>
                            </>
                        )}
                    </ul>
                </div>

                <button
                    className={`hamburger-btn${isMenuOpen ? ' open' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
        </header>
    );
};

export default Header;

