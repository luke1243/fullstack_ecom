import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { SERVER_HOST } from '../../config/global_constants';

export const Login = () => 
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateField = (fieldName, value) => 
    {
        switch(fieldName) 
        {
            case 'email':
                if (!value.trim()) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                return '';
                
            case 'password':
                if (!value) return 'Password is required';
                if (value.length < 6) return 'Password must be at least 6 characters';
                return '';
                
            default:
                return '';
        }
    };

    const validateForm = () => 
    {
        const newErrors = 
        {
            email: validateField('email', email),
            password: validateField('password', password)
        };
        
        setErrors(newErrors);
        
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleBlur = (field) => (e) => {
        setTouched({ ...touched, [field]: true });
        const error = validateField(field, e.target.value);
        setErrors({ ...errors, [field]: error });
    };

    const handleChange = (field) => (e) => 
    {
        if (field === 'email') 
        {
            setEmail(e.target.value);
        } 
        
        else if (field === 'password') 
        {
            setPassword(e.target.value);
        }

        if (errors[field]) 
        {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const handleSubmit = (e) => 
    {
        e.preventDefault();
        
        setTouched({
            email: true,
            password: true
        });
        
        if (!validateForm()) 
        {
            const firstError = document.querySelector('.error-message');
            
            if (firstError) 
            {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        setIsSubmitting(true);
        
        axios.post(`${SERVER_HOST}/users/login/${email}/${password}`)
            .then(res => 
            {
                if (res.data) 
                {
                    const fullToken = res.data.token;
                    console.log('Token length:', fullToken.length);
        
                    localStorage.setItem('token', fullToken);
                    localStorage.setItem('name', res.data.name);
                    localStorage.setItem('email', res.data.email);
                    localStorage.setItem('accessLevel', res.data.accessLevel);
        
                    setIsLoggedIn(true);
                }
            })
            .catch(err => 
            {
                console.log('Full error object:', err);
                console.log('Error response:', err.response);
                console.log('Error data:', err.response?.data);
    
                if (err.response && err.response.data) 
                {
                    const errorMessage = err.response.data.message || err.response.data || 'Login failed';
                    setErrors({ form: errorMessage });
                } 
            
                else 
                {
                    setErrors({ form: 'Login failed. Please check your credentials.' });
                }
                setIsSubmitting(false);
            });
    };

    if (isLoggedIn) 
    {
        return <Navigate to="/products" replace />;
    }

    return (
        <div className="form-container">
            <h2>Login to Your Account</h2>

            {errors.form && (
                <div className="error-message form-error">
                    {errors.form}
                </div>
            )}
            
            <form onSubmit={handleSubmit} noValidate>

                <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChange('email')}
                        onBlur={handleBlur('email')}
                        placeholder="Enter your email"
                        autoComplete="email"
                        autoFocus
                        className={touched.email && errors.email ? 'error' : ''}
                        disabled={isSubmitting}
                    />
                    {touched.email && errors.email && (
                        <div className="field-error">{errors.email}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password *</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChange('password')}
                        onBlur={handleBlur('password')}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className={touched.password && errors.password ? 'error' : ''}
                        disabled={isSubmitting}
                    />
                    {touched.password && errors.password && (
                        <div className="field-error">{errors.password}</div>
                    )}
                </div>
                
                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                    <Link to="/" className="btn btn-cancel">
                        Cancel
                    </Link>
                </div>
            </form>
            
            <p className="register-link">
                Don't have an account? <Link to="/register">Create one here</Link>
            </p>
        </div>
    );
};