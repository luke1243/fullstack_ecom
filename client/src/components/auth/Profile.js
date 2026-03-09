import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { SERVER_HOST } from '../../config/global_constants';

export const Profile = () => {
    const userName = localStorage.name || 'User';
    const userEmail = localStorage.email || 'Not provided';
    const accessLevel = localStorage.accessLevel === '1' ? 'User' : 'Administrator';

    const [profilePhoto, setProfilePhoto] = useState('pfp.png');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.token && localStorage.token !== 'null') {
            axios.get(`${SERVER_HOST}/users/profile`, {
                headers: { Authorization: localStorage.token }
            })
                .then(res => {
                    if (res.data.profilePhotoFilename) {
                        setProfilePhoto(res.data.profilePhotoFilename);
                    }
                })
                .catch(err => console.error('Error loading profile:', err));
        }
    }, []);

    const getPhotoSrc = () => {
        if (profilePhoto === 'pfp.png') {
            return '/pfp.png';
        }
        return `${SERVER_HOST}/users/profile/photo/${profilePhoto}`;
    };

    const handleChangePhoto = () => {
        fileInputRef.current.click();
    };

    const handleFileSelected = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('profilePhoto', file);

        axios.post(`${SERVER_HOST}/users/profile/photo`, formData, {
            headers: {
                Authorization: localStorage.token,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                setProfilePhoto(res.data.profilePhotoFilename);
                setUploading(false);
            })
            .catch(err => {
                console.error('Error uploading photo:', err);
                setUploading(false);
            });
    };

    return (
        <div className="products-container">
            <h1 className="page-title">User Profile</h1>

            <div className="profile-layout">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <img
                                src={getPhotoSrc()}
                                alt={userName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                onError={(e) => { e.target.src = '/pfp.png'; }}
                            />
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
                        <h3>Quick Actions</h3>
                        <div className="actions-grid">
                            <button className="action-btn secondary" onClick={handleChangePhoto} disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Change Profile Picture'}
                            </button>
                            <Link to="/purchase-history" className="action-btn secondary" style={{ textAlign: 'center', textDecoration: 'none' }}>
                                View Purchase History
                            </Link>
                            <Link to="/logout" className="action-btn secondary" style={{ textAlign: 'center', textDecoration: 'none' }}>
                                Logout
                            </Link>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelected}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
};
