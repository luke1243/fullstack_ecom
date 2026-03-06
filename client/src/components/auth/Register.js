import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { SERVER_HOST } from '../../config/global_constants';

export const Register = () => 
{
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isRegistered, setIsRegistered] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateField = (fieldName, value) => 
    {
        switch(fieldName) 
        {
            case 'name':
                if (!value.trim()) return 'Name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                if (value.trim().length > 50) return 'Name cannot exceed 50 characters';
                return '';
                
            case 'email':
                if (!value.trim()) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                return '';
                
            case 'password':
                if (!value) return 'Password is required';
                if (value.length < 6) return 'Password must be at least 6 characters';
                if (value.length > 30) return 'Password cannot exceed 30 characters';

                const hasLetter = /[a-zA-Z]/.test(value);
                const hasNumber = /[0-9]/.test(value);
                if (!hasLetter || !hasNumber) return 'Password must contain at least one letter and one number';
                return '';
                
            case 'confirmPassword':
                if (!value) return 'Please confirm your password';
                if (value !== password) return 'Passwords do not match';
                return '';
                
            default:
                return '';
        }
    };

    const validateForm = () => 
    {
        const newErrors = 
        {
            name: validateField('name', name),
            email: validateField('email', email),
            password: validateField('password', password),
            confirmPassword: validateField('confirmPassword', confirmPassword)
        };
        
        setErrors(newErrors);
        
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleBlur = (field) => (e) => 
    {
        setTouched({ ...touched, [field]: true });
        const error = validateField(field, e.target.value);
        setErrors({ ...errors, [field]: error });
    };

    const handleChange = (field) => (e) => 
    {
        switch(field) 
        {
            case 'name':
                setName(e.target.value);
                break;
            case 'email':
                setEmail(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            case 'confirmPassword':
                setConfirmPassword(e.target.value);
                break;
            default:
                break;
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
            name: true,
            email: true,
            password: true,
            confirmPassword: true
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
        
        axios.post(`${SERVER_HOST}/users/register/${name}/${email}/${password}`)
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
        
                setIsRegistered(true); 
                }
            })
            .catch(err => 
            {
                if (err.response && err.response.data) 
                {
                    const errorMessage = err.response.data.message || 'Registration failed';
                    setErrors({ form: errorMessage });
                } 

                else 
                {
                    setErrors({ form: 'Registration failed. Please try again.' });
                }
                console.log(err);
            });
    };

    if (isRegistered) 
    {
        return <Navigate to="/products" replace />;
    }

    return (
        <div className="form-container">
            <h2>Create Account</h2>
            
            {errors.form && (
                <div className="error-message form-error">
                    {errors.form}
                </div>
            )}
            
            <form onSubmit={handleSubmit} noValidate>

                <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={handleChange('name')}
                        onBlur={handleBlur('name')}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        autoFocus
                        className={touched.name && errors.name ? 'error' : ''}
                    />
                    {touched.name && errors.name && (
                        <div className="field-error">{errors.name}</div>
                    )}
                </div>

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
                        className={touched.email && errors.email ? 'error' : ''}
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
                        placeholder="Create a password"
                        autoComplete="new-password"
                        className={touched.password && errors.password ? 'error' : ''}
                    />
                    {touched.password && errors.password && (
                        <div className="field-error">{errors.password}</div>
                    )}
                    <small className="hint">
                        Password must be at least 6 characters with at least one letter and one number
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password *</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        onBlur={handleBlur('confirmPassword')}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        className={touched.confirmPassword && errors.confirmPassword ? 'error' : ''}
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                        <div className="field-error">{errors.confirmPassword}</div>
                    )}
                </div>
                
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        Register
                    </button>
                    <Link to="/" className="btn btn-cancel">
                        Cancel
                    </Link>
                </div>
            </form>
            
            <p className="login-link">
                Already have an account? <Link to="/login">Sign in here</Link>
            </p>
        </div>
    );
};