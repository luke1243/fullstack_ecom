import React, { useState } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '../../config/global_constants';

export const ProductModal = ({ product, onClose }) => 
{
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState('');

    const handleOverlayClick = (e) => 
    {
        if (e.target.className === 'modal-overlay') 
        {
            onClose();
        }
    };

    const nextImage = () => 
    {
        if (product.photos && currentImageIndex < product.photos.length - 1) 
        {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const prevImage = () => 
    {
        if (currentImageIndex > 0) 
        {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleAddToCart = () => 
    {
    setAddingToCart(true);
    setCartMessage('');
    
    const token = localStorage.getItem('token');
    
    const config = {};
    if (token && token !== 'null' && token !== '') 
    {
        config.headers = 
        { 
            'Authorization': token 
        };
    }
    
    axios.post(`${SERVER_HOST}/cart/add`, 
        { 
            productId: product._id, 
            quantity: 1 
        },
        config
    )

    .then(res => 
    {
        if (res.data) 
        {
            setCartMessage('✓ Added to cart!');
            setTimeout(() => setCartMessage(''), 3000);
        }
        setAddingToCart(false);
    })
    .catch(err => 
    {
        console.log('Error adding to cart:', err);
        console.log('Error response:', err.response?.data);
        
        let errorMsg = 'Error adding to cart';

        if (err.response?.data?.message) 
        {
            errorMsg = err.response.data.message;
        } 
        
        else if (err.response?.data) 
        {
            errorMsg = err.response.data;
        }
        
        setCartMessage(errorMsg);
        setAddingToCart(false);
        setTimeout(() => setCartMessage(''), 3000);
    });
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                
                <div className="modal-body">
                    <div className="modal-images">
                        {product.photos && product.photos.length > 0 ? (
                            <>
                                <div className="main-image">
                                    <img 
                                        src={`${SERVER_HOST}/products/photo/${product.photos[currentImageIndex].filename}`} 
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300';
                                        }}
                                    />
                                </div>

                                {product.photos.length > 1 && (
                                    <>
                                        <div className="image-navigation">
                                            <button 
                                                onClick={prevImage} 
                                                disabled={currentImageIndex === 0}
                                                className="nav-button"
                                            >
                                                ←
                                            </button>
                                            <span className="image-counter">
                                                {currentImageIndex + 1} / {product.photos.length}
                                            </span>
                                            <button 
                                                onClick={nextImage} 
                                                disabled={currentImageIndex === product.photos.length - 1}
                                                className="nav-button"
                                            >
                                                →
                                            </button>
                                        </div>
                                        
                                        <div className="thumbnail-strip">
                                            {product.photos.map((photo, index) => (
                                                <img 
                                                    key={photo._id}
                                                    src={`${SERVER_HOST}/products/photo/${photo.filename}`}
                                                    alt={`${product.name} ${index + 1}`}
                                                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/50';
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="no-images">No images available</div>
                        )}
                    </div>

                    <div className="modal-details">
                        <h2 className="modal-title">{product.name}</h2>
                        
                        <div className="modal-price">€{product.price}</div>
                        
                        <div className="detail-section">
                            <h3>Description</h3>
                            <p className="modal-description">{product.description}</p>
                        </div>
                        
                        <div className="detail-row">
                            <span className="detail-label">Category:</span>
                            <span className="detail-value">{product.category}</span>
                        </div>
                        
                        <div className="detail-row">
                            <span className="detail-label">Stock:</span>
                            <span className="detail-value">{product.stock}</span>
                        </div>
                        
                        {product.brand && (
                            <div className="detail-row">
                                <span className="detail-label">Brand:</span>
                                <span className="detail-value">{product.brand}</span>
                            </div>
                        )}
                        
                        {product.sku && (
                            <div className="detail-row">
                                <span className="detail-label">SKU:</span>
                                <span className="detail-value">{product.sku}</span>
                            </div>
                        )}
                        
                        <div className="detail-row">
                            <span className="detail-label">Added on:</span>
                            <span className="detail-value">
                                {new Date(product.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        
                        <div className="add-to-cart-section">
                            {cartMessage && <div className="cart-message">{cartMessage}</div>}
                            <button 
                                className="add-to-cart-btn"
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                            >
                                {addingToCart ? 'Adding...' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};