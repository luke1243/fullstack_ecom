import React from 'react';

export const Profile = () => {
    const userName = localStorage.name || 'User';

    return (
        <div className="products-container" style={{ textAlign: 'center', padding: '50px' }}>
            <h1>User Profile</h1>
            <div className="table-container" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
                <p><strong>Name:</strong> {userName}</p>
                <p><strong>Email:</strong> {localStorage.email || 'Not provided'}</p>
                <p><strong>Access Level:</strong> {localStorage.accessLevel === '1' ? 'User' : 'Administrator'}</p>
            </div>
        </div>
    );
};
