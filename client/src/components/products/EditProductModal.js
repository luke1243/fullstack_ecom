import React, { useState } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '../../config/global_constants';

export const EditProductModal = ({ product, onClose, onProductUpdated, onProductDeleted }) => {
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price);
    const [stock, setStock] = useState(product.stock);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState('');

    const handleOverlayClick = (e) => {
        if (e.target.className === 'modal-overlay') {
            onClose();
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        const token = localStorage.getItem('token');

        axios.put(`${SERVER_HOST}/products/${product._id}`,
            { name, description, price: Number(price), stock: Number(stock) },
            { headers: { Authorization: token } }
        )
            .then(res => {
                setMessage('✓ Product updated successfully!');
                setSaving(false);
                onProductUpdated(res.data);
            })
            .catch(err => {
                const errorMsg = err.response?.data?.message || err.response?.data || 'Error updating product';
                setMessage(errorMsg);
                setSaving(false);
                setTimeout(() => setMessage(''), 3000);
            });
    };

    const handleDelete = () => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        setDeleting(true);
        setMessage('');

        const token = localStorage.getItem('token');

        axios.delete(`${SERVER_HOST}/products/${product._id}`,
            { headers: { Authorization: token } }
        )
            .then(() => {
                setMessage('✓ Product deleted successfully!');
                setDeleting(false);
                onProductDeleted(product._id);
            })
            .catch(err => {
                const errorMsg = err.response?.data?.message || err.response?.data || 'Error deleting product';
                setMessage(errorMsg);
                setDeleting(false);
                setTimeout(() => setMessage(''), 3000);
            });
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" style={{ maxWidth: '600px' }}>
                <button className="modal-close" onClick={onClose}>×</button>

                <div className="edit-modal-body">
                    <h2 className="edit-modal-title">Edit Product</h2>

                    {message && <div className="edit-modal-message">{message}</div>}

                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                minLength={3}
                                maxLength={100}
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="edit-modal-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                minLength={10}
                                rows={4}
                            />
                        </div>

                        <div className="form-group">
                            <label>Price (€)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                min="0.01"
                                max="1000000"
                                step="0.01"
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock</label>
                            <input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                required
                                min="0"
                            />
                        </div>

                        <div className="edit-modal-actions">
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                {'Save Changes'}
                            </button>

                            <button
                                type="button"
                                className="btn edit-modal-delete-btn"
                                onClick={handleDelete}
                            >
                                {'Delete Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
