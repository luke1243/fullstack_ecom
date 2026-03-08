import React from 'react';

export const Profile = () => {
    const userName = localStorage.name || 'User';
    const userEmail = localStorage.email || 'Not provided';
    const accessLevel = localStorage.accessLevel === '1' ? 'User' : 'Administrator';

    return (
        <div className="products-container">
            <h1 className="page-title">User Profile</h1>

            <div className="profile-layout">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <h2>{userName}</h2>
                        <p className="profile-role">{accessLevel}</p>
                    </div>

                    <div className="profile-details">
                        <div className="detail-item">
                            <span className="detail-label">Email</span>
                            <span className="detail-value">{userEmail}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Member Since</span>
                            <span className="detail-value">January 2024</span>
                        </div>
                    </div>
                </div>

                <div className="profile-main">
                    <section className="profile-section">
                        <h3>Account Statistics</h3>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <span className="stat-value">12</span>
                                <span className="stat-label">Total Orders</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-value">€1,245.50</span>
                                <span className="stat-label">Total Spent</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-value">5</span>
                                <span className="stat-label">Reviews</span>
                            </div>
                        </div>
                    </section>

                    <section className="profile-section">
                        <h3>Quick Actions</h3>
                        <div className="actions-grid">
                            <button className="action-btn secondary">Edit Profile</button>
                            <button className="action-btn secondary">Change Password</button>
                            <button className="action-btn secondary">Address Book</button>
                            <button className="action-btn secondary">Payment Methods</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

