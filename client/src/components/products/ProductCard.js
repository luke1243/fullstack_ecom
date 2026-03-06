import React from 'react';
import { SERVER_HOST } from '../../config/global_constants';

export const ProductCard = ({ product, onClick }) => {
    return (
        <div className="product-card" onClick={onClick}>
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
                
                <p className="card-price">€{product.price}</p>
                
                <p className="card-description">
                    {product.description && product.description.length > 80
                        ? `${product.description.substring(0, 80)}...`
                        : product.description}
                </p>

                <span className="card-category">{product.category}</span>
                
                <p className="card-stock">
                    {product.stock > 0 
                        ? `In stock: ${product.stock}` 
                        : 'Out of stock'}
                </p>
            </div>
            
            <div className="card-footer">
                <span className="view-details">Tap for details →</span>
            </div>
        </div>
    );
};