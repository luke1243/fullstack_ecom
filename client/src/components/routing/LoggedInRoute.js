import React from 'react';
import { Navigate } from 'react-router-dom';
import { ACCESS_LEVEL_GUEST } from '../../config/global_constants';

export const LoggedInRoute = ({ children }) => {
    const isLoggedIn = localStorage.accessLevel > ACCESS_LEVEL_GUEST;
    
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};