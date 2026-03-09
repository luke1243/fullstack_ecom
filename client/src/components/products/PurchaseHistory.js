import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '../../config/global_constants';

export const PurchaseHistory = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

    useEffect(() => {
        if (localStorage.token && localStorage.token !== 'null') {
            axios.get(`${SERVER_HOST}/users/purchases`, {
                headers: { Authorization: localStorage.token }
            })
                .then(res => {
                    setPurchases(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setError('Error loading purchase history');
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 600);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getFilteredPurchases = () => {
        let filtered = [...purchases];

        // Search by name
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchLower)
            );
        }

        // Filter by category
        if (category) {
            filtered = filtered.filter(p => p.category === category);
        }

        // Sort
        if (sort === 'price_asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'price_desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sort === 'name_asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'name_desc') {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        }

        return filtered;
    };

    if (loading) return <div className="loading">Loading purchase history...</div>;

    const filteredPurchases = getFilteredPurchases();

    return (
        <div className="products-container">
            <h1 className="page-title">Purchase History</h1>

            {error && <div className="error-message">{error}</div>}

            <div className="search-filter-bar">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="filter-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home">Home</option>
                    <option value="Sports">Sports</option>
                    <option value="Other">Other</option>
                </select>

                <select
                    className="filter-select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="">Sort By</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A-Z</option>
                    <option value="name_desc">Name: Z-A</option>
                </select>
            </div>

            {filteredPurchases.length > 0 ? (
                <>
                    {isMobile ? (
                        <div className="cards-container">
                            {filteredPurchases.map((product, index) => (
                                <div className="product-card" key={`${product._id}-${index}`}>
                                    <div className="card-image">
                                        {product.photos && product.photos.length > 0 ? (
                                            <img
                                                src={`${SERVER_HOST}/products/photo/${product.photos[0].filename}`}
                                                alt={product.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/150';
                                                }}
                                            />
                                        ) : (
                                            <div className="no-image">No image available</div>
                                        )}
                                    </div>

                                    <div className="card-details">
                                        <h3 className="card-title">{product.name}</h3>
                                        <p className="card-price">€{product.price.toFixed(2)}</p>
                                        <span className="card-category">{product.category}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPurchases.map((product, index) => (
                                        <tr key={`${product._id}-${index}`}>
                                            <td className="product-image-cell">
                                                {product.photos && product.photos.length > 0 ? (
                                                    <img
                                                        src={`${SERVER_HOST}/products/photo/${product.photos[0].filename}`}
                                                        alt={product.name}
                                                        className="product-thumbnail"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/50';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="no-image">No img</div>
                                                )}
                                            </td>
                                            <td className="product-name">{product.name}</td>
                                            <td className="product-price">€{product.price.toFixed(2)}</td>
                                            <td className="product-category">{product.category}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            ) : (
                <div className="empty-cart">
                    <p>{purchases.length > 0 ? 'No purchases match your filters.' : "You haven't made any purchases yet."}</p>
                    <a href="/products" className="nav-link" style={{ background: '#3498db', display: 'inline-block', marginTop: '20px' }}>
                        Start Shopping
                    </a>
                </div>
            )}
        </div>
    );
};
