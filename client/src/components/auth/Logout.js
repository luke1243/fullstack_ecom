import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { SERVER_HOST, ACCESS_LEVEL_GUEST } from '../../config/global_constants';

export const Logout = () => 
{
    const [isLoggedOut, setIsLoggedOut] = useState(false);

    useEffect(() => 
    {
        axios.post(`${SERVER_HOST}/users/logout`)
            .then(() => 
            {
                localStorage.clear();

                localStorage.setItem('name', 'GUEST');
                localStorage.setItem('accessLevel', ACCESS_LEVEL_GUEST);
                localStorage.setItem('token', '');
                
                setIsLoggedOut(true);
            })
            
            .catch(err => 
            {
                console.log(err);

                localStorage.clear();
                localStorage.setItem('name', 'GUEST');
                localStorage.setItem('accessLevel', ACCESS_LEVEL_GUEST);
                localStorage.setItem('token', '');
                setIsLoggedOut(true);
            });
    }, []);

    if (isLoggedOut) 
    {
        return <Navigate to="/products" replace />;
    }

    return (
        <div className="logout-message">
            Logging out...
        </div>
    );
};