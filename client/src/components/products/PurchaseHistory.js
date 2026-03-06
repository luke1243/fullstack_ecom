import React from 'react';

export const PurchaseHistory = () => {
    return (
        <div className="products-container" style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Purchase History</h1>
            <div className="empty-cart">
                <p>You haven't made any purchases yet.</p>
                <a href="/products" className="nav-link" style={{ background: '#3498db', display: 'inline-block', marginTop: '20px' }}>
                    Start Shopping
                </a>
            </div>
        </div>
    );
};
