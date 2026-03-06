import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ACCESS_LEVEL_GUEST } from '../../config/global_constants';

export const Header = () => 
{
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
    const [userName, setUserName] = useState(localStorage.name || 'Guest');
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.accessLevel > ACCESS_LEVEL_GUEST);
    const navigate = useNavigate();

    useEffect(() => 
    {
        const handleResize = () => 
        {
            const mobile = window.innerWidth < 600;
            setIsMobile(mobile);

            if (!mobile) 
            {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => 
    {
        const handleStorageChange = () => 
        {
            setUserName(localStorage.name || 'Guest');
            setIsLoggedIn(localStorage.accessLevel > ACCESS_LEVEL_GUEST);
        };

        window.addEventListener('storage', handleStorageChange);
        
        const interval = setInterval(() => 
        {
            setUserName(localStorage.name || 'Guest');
            setIsLoggedIn(localStorage.accessLevel > ACCESS_LEVEL_GUEST);
        }, 1000);

        return () => 
        {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const toggleMenu = () => 
    {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => 
    {
        setIsMenuOpen(false);
    };

    const handleLogout = () => 
    {
        navigate('/logout');
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <Link to="/products" onClick={closeMenu}>E-Commerce Store</Link>
                </div>
                
                {isMobile && (
                    <button 
                        className={`hamburger-btn ${isMenuOpen ? 'open' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>
                )}
                
                <nav className={`nav-menu ${isMobile ? 'mobile' : ''} ${isMenuOpen ? 'open' : ''}`}>
                    <Link to="/products" className="nav-link" onClick={closeMenu}>Products</Link>
                    <Link to="/cart" className="nav-link" onClick={closeMenu}>Cart</Link>
                    
                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
                            <Link to="/register" className="nav-link" onClick={closeMenu}>Register</Link>
                        </>
                    ) : (
                        <>
                            <span className="welcome-message">Welcome, {userName}</span>
                            <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};