import { SERVER_HOST } from '../../config/global_constants';
import React from 'react';

export const ProductTableRow = ({ product, isTablet, onClick, isAdmin, onEditClick }) => {
    return (
        <tr onClick={onClick} className="product-row" style={{ cursor: 'pointer' }}>
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
                    <div className="no-image">No image</div>
                )}
            </td>

            <td className="product-name">{product.name}</td>

            <td className="product-price">€{product.price}</td>

            {!isTablet && (
                <>
                    <td className="product-description">
                        {product.description && product.description.length > 50
                            ? `${product.description.substring(0, 50)}...`
                            : product.description}
                    </td>

                    <td className="product-category">{product.category}</td>

                    <td className="product-stock">{product.stock}</td>
                </>
            )}

            <td className="product-view">
                <span className="view-details">View →</span>
            </td>

            {isAdmin && (
                <td className="product-edit-cell">
                    <button
                        className="edit-btn"
                        onClick={(e) => { e.stopPropagation(); onEditClick(); }}
                    >
                        Edit
                    </button>
                </td>
            )}
        </tr>
    );
};