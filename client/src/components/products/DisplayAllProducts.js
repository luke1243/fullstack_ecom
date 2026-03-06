import { ProductModal } from './ProductModal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '../../config/global_constants';
import { ProductTable } from './ProductTable';
import { ProductCard } from './ProductCard';

export const DisplayAllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

    useEffect(() => {
        axios.get(`${SERVER_HOST}/products`)
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
    }, []);

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

    if (loading) return <div className="loading">Loading products...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="products-container">
            <h1>Our Products</h1>
            
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
        </div>
    );
};