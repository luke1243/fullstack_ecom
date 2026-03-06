import { ShoppingCart } from './components/cart/ShoppingCart';
import { Header } from './components/layout/Header';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { ACCESS_LEVEL_GUEST } from './config/global_constants';

import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Logout } from './components/auth/Logout';

import { DisplayAllProducts } from './components/products/DisplayAllProducts';
import { Profile } from './components/auth/Profile';
import { PurchaseHistory } from './components/products/PurchaseHistory';

import { LoggedInRoute } from './components/routing/LoggedInRoute';

if (typeof localStorage.accessLevel === 'undefined') {
    localStorage.setItem('name', 'GUEST');
    localStorage.setItem('accessLevel', ACCESS_LEVEL_GUEST);
    localStorage.setItem('token', null);
}

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/register" element={<Register />} />

                    <Route path="/products" element={<DisplayAllProducts />} />

                    <Route path="/cart" element={<ShoppingCart />} />

                    <Route path="/profile" element={<LoggedInRoute><Profile /></LoggedInRoute>} />

                    <Route path="/purchase-history" element={<LoggedInRoute><PurchaseHistory /></LoggedInRoute>} />

                    <Route path="/logout" element={<LoggedInRoute><Logout /></LoggedInRoute>} />

                    <Route path="/" element={<Navigate to="/products" replace />} />

                    <Route path="*" element=
                        {
                            <div className="not-found">
                                <h2>404 - Page Not Found</h2>
                                <a href="/products">Go to Products</a>
                            </div>
                        } />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
