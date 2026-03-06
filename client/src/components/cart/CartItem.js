import React, { useState } from 'react';
import { SERVER_HOST } from '../../config/global_constants';

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => 
{
    const [quantity, setQuantity] = useState(item.quantity);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleQuantityChange = (e) => 
    {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity >= 1) 
        {
            setQuantity(newQuantity);
        }
    };

    const handleUpdate = () => 
    {
        if (quantity !== item.quantity) 
        {
            setIsUpdating(true);
            onUpdateQuantity(item._id, quantity)
                .finally(() => setIsUpdating(false));
        }
    };

    const handleRemove = () => 
    {
        if (window.confirm('Remove this item from your cart?')) 
        {
            onRemove(item._id);
        }
    };

    return (
        <div className="cart-item">
            <div className="cart-item-image">
                {item.imageFilename ? 
                (
                    <img 
                        src={`${SERVER_HOST}/products/photo/${item.imageFilename}`}
                        alt={item.name}
                        onError={(e) => 
                        {
                            e.target.src = 'https://via.placeholder.com/80';
                        }}
                    />
                ) : (
                    <div className="no-image">No image</div>
                )}
            </div>
            
            <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-price">€{item.price.toFixed(2)}</p>
                
                <div className="cart-item-actions">
                    <div className="quantity-control">
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="quantity-input"
                        />
                        <button 
                            onClick={handleUpdate}
                            disabled={quantity === item.quantity || isUpdating}
                            className="update-btn"
                        >
                            {isUpdating ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                    
                    <button 
                        onClick={handleRemove}
                        className="remove-btn"
                    >
                        Remove
                    </button>
                </div>
            </div>
            
            <div className="cart-item-total">
                €{(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    );
};