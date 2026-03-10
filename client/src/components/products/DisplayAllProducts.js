import { ProductModal } from './ProductModal';
import { EditProductModal } from './EditProductModal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_HOST, ACCESS_LEVEL_ADMIN } from '../../config/global_constants';
import { ProductTable } from './ProductTable';
import { ProductCard } from './ProductCard';

export const DisplayAllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('');

    const isAdmin = parseInt(localStorage.getItem('accessLevel')) === ACCESS_LEVEL_ADMIN;

    useEffect(() => {
        axios.get(`${SERVER_HOST}/products`, {
            params: { search, category, sort }
        })
            .then(res => {
                if (res.data) {
                    setProducts(res.data);
                }
                setLoading(false);
            })
            .catch(err => {
                setError('Error fetching products');
                setLoading(false);
                console.log(err);
            });
    }, [search, category, sort]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 600);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const handleEditClick = (product) => {
        setEditProduct(product);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditProduct(null);
    };

    const handleProductUpdated = (updatedProduct) => {
        setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
    };

    const handleProductDeleted = (deletedId) => {
        setProducts(products.filter(p => p._id !== deletedId));
    };

    if (loading) return <div className="loading">Loading products...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="products-container">
            <h1>Our Products</h1>

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

            {products.length === 0 ? (
                <p className="no-products">No products available</p>
            ) : (
                <>
                    {isMobile ? (
                        <div className="cards-container">
                            {products.map(product => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onClick={() => handleProductClick(product)}
                                />
                            ))}
                        </div>
                    ) : (
                        <ProductTable
                            products={products}
                            onRowClick={handleProductClick}
                            isAdmin={isAdmin}
                            onEditClick={handleEditClick}
                        />
                    )}
                </>
            )}

            {showModal && selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={closeModal}
                />
            )}

            {showEditModal && editProduct && (
                <EditProductModal
                    product={editProduct}
                    onClose={closeEditModal}
                    onProductUpdated={handleProductUpdated}
                    onProductDeleted={handleProductDeleted}
                />
            )}
        </div>
    );
};