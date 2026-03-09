import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { SERVER_HOST, ACCESS_LEVEL_GUEST } from '../../config/global_constants';

export const ShoppingCart = () => {
    const [cart, setCart] = useState({
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);
    const [purchasing, setPurchasing] = useState(false);
    const [purchaseMessage, setPurchaseMessage] = useState('');

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = () => {
        setLoading(true);

        const config = {};

        if (localStorage.token && localStorage.token !== 'null') {
            config.headers = { Authorization: localStorage.token };
        }

        axios.get(`${SERVER_HOST}/cart`, config)
            .then(res => {
                if (res.data) {
                    setCart(res.data);
                }
                setLoading(false);
            })
            .catch(err => {
                setError('Error loading cart');
                setLoading(false);
                console.log(err);
            });
    };

    const updateQuantity = (itemId, newQuantity) => {
        setUpdating(true);

        const config = {};
        if (localStorage.token && localStorage.token !== 'null') {
            config.headers = { Authorization: localStorage.token };
        }

        return axios.put(`${SERVER_HOST}/cart/update/${itemId}`,
            { quantity: newQuantity },
            config
        )
            .then(res => {
                if (res.data) {
                    setCart(res.data);
                }
                setUpdating(false);
                setError('');
            })
            .catch(err => {
                setError('Error updating cart');
                setUpdating(false);
                console.log(err);
                throw err;
            });
    };

    const removeItem = (itemId) => {
        const config = {};

        if (localStorage.token && localStorage.token !== 'null') {
            config.headers = { Authorization: localStorage.token };
        }

        axios.delete(`${SERVER_HOST}/cart/remove/${itemId}`, config)
            .then(res => {
                if (res.data) {
                    setCart(res.data);
                }
                setError('');
            })
            .catch(err => {
                setError('Error removing item');
                console.log(err);
            });
    };

    const clearCart = () => {
        if (!window.confirm('Clear your entire cart?')) return;

        const config = {};
        if (localStorage.token && localStorage.token !== 'null') {
            config.headers = { Authorization: localStorage.token };
        }

        axios.delete(`${SERVER_HOST}/cart/clear`, config)
            .then(res => {
                if (res.data) {
                    setCart({
                        items: [],
                        subtotal: 0,
                        tax: 0,
                        total: 0
                    });
                }
                setError('');
            })
            .catch(err => {
                setError('Error clearing cart');
                console.log(err);
            });
    };

    const handlePurchase = () => {
        if (!localStorage.token || localStorage.token === 'null') {
            setError('Please log in to make a purchase');
            return;
        }

        setPurchasing(true);
        setError('');
        setPurchaseMessage('');

        const productIds = cart.items.flatMap(item => Array(item.quantity).fill(item.productId));

        axios.post(`${SERVER_HOST}/users/purchase`,
            { productIds },
            { headers: { Authorization: localStorage.token } }
        )
            .then(res => {
                setPurchasing(false);
                setPurchaseMessage('✓ Purchase successful!');
                clearCart();
                setTimeout(() => setPurchaseMessage(''), 3000);
            })
            .catch(err => {
                setPurchasing(false);
                setPurchaseMessage('Error processing purchase');
                setTimeout(() => setPurchaseMessage(''), 3000);
                console.log(err);
            });
    };

    if (loading) return <div className="loading">Loading cart...</div>;

    return (
        <div className="shopping-cart-container">
            <h1>Shopping Cart</h1>

            {error && <div className="error-message">{error}</div>}

            {cart.items.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty</p>
                    <Link to="/products" className="continue-shopping">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items">
                        {cart.items.map(item => (
                            <CartItem
                                key={item._id}
                                item={item}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeItem}
                            />
                        ))}

                        <button
                            onClick={clearCart}
                            className="clear-cart-btn"
                            disabled={updating}
                        >
                            Clear Cart
                        </button>
                    </div>

                    <CartSummary
                        subtotal={cart.subtotal}
                        tax={cart.tax}
                        total={cart.total}
                        itemCount={cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                        onPurchase={handlePurchase}
                        purchasing={purchasing}
                        purchaseMessage={purchaseMessage}
                    />
                </div>
            )}
        </div>
    );
};