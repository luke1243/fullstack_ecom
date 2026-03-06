import React from 'react';
import { Link } from 'react-router-dom';

export const CartSummary = ({ subtotal, tax, total, itemCount }) =>
{
    return (
        <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
                <span>Subtotal ({itemCount} items):</span>
                <span>€{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
                <span>Tax (estimated):</span>
                <span>€{tax.toFixed(2)}</span>
            </div>
            
            <div className="summary-row total">
                <span>Order Total:</span>
                <span>€{total.toFixed(2)}</span>
            </div>
            
            <Link to="/checkout" className="checkout-btn">
                Proceed to Checkout
            </Link>
            
            <Link to="/products" className="continue-shopping">
                Continue Shopping
            </Link>
        </div>
    );
};