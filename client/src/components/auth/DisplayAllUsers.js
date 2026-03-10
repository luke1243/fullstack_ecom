import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '../../config/global_constants';

export const DisplayAllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [level, setLevel] = useState('');
    const [sort, setSort] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get(`${SERVER_HOST}/users/all`, {
            headers: { Authorization: token },
            params: { search, level, sort }
        })
            .then(res => {
                if (res.data) {
                    setUsers(res.data);
                }
                setLoading(false);
            })
            .catch(err => {
                setError('Error fetching users');
                setLoading(false);
                console.log(err);
            });
    }, [search, level, sort]);

    const handleDelete = (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        const token = localStorage.getItem('token');

        axios.delete(`${SERVER_HOST}/users/${userId}`, {
            headers: { Authorization: token }
        })
            .then(() => {
                setUsers(users.filter(u => u._id !== userId));
            })
            .catch(err => {
                console.error('Error deleting user:', err);
            });
    };

    const getPhotoSrc = (user) => {
        if (!user.profilePhotoFilename || user.profilePhotoFilename === 'pfp.png') {
            return '/pfp.png';
        }
        return `${SERVER_HOST}/users/profile/photo/${user.profilePhotoFilename}`;
    };

    if (loading) return <div className="loading">Loading users...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="products-container">
            <h1>All Users</h1>

            <div className="search-filter-bar">
                <input
                    type="text"
                    placeholder="Search by username..."
                    className="search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="filter-select"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                >
                    <option value="">All Levels</option>
                    <option value="1">User</option>
                    <option value="2">Administrator</option>
                </select>

                <select
                    className="filter-select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="">Sort By</option>
                    <option value="name_asc">Name: A-Z</option>
                    <option value="name_desc">Name: Z-A</option>
                </select>
            </div>

            {users.length === 0 ? (
                <p className="no-products">No users found</p>
            ) : (
                <div className="table-container">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Picture</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Level</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="product-row">
                                    <td className="product-image-cell">
                                        <img
                                            src={getPhotoSrc(user)}
                                            alt={user.name}
                                            className="product-thumbnail"
                                            style={{ borderRadius: '50%' }}
                                            onError={(e) => { e.target.src = '/pfp.png'; }}
                                        />
                                    </td>
                                    <td className="product-name">{user.name}</td>
                                    <td style={{ color: '#666' }}>{user.email}</td>
                                    <td>
                                        <span className={`level`}>
                                            {user.accessLevel === 2 ? 'Administrator' : 'User'}
                                        </span>
                                    </td>
                                    <td className="product-edit-cell">
                                        <button
                                            className="btn edit-modal-delete-btn"
                                            style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
